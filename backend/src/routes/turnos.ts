import { Router, type Response } from 'express'
import { pool } from '../db/postgres.js'
import { Evento } from '../models/Evento.js'
import { verificarFuncionario } from '../middleware/autenticacion.js'

const router = Router()

const COLUMNAS_TURNO = 'id, numero, tipo, estado, modulo, sucursal_id AS "sucursalId"'

// cambio en vista de turnos por sucursal
const pantallas = new Map<number, Set<Response>>()

export function notificarCambio(sucursalId: number) {
  for (const pantalla of pantallas.get(sucursalId) ?? []) {
    pantalla.write('data: actualizado\n\n')
  }
}

router.get('/eventos', (req, res) => {
  const sucursalId = Number(req.query.sucursalId)
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' })
  res.flushHeaders()

  if (!pantallas.has(sucursalId)) pantallas.set(sucursalId, new Set())
  pantallas.get(sucursalId)!.add(res)
  req.on('close', () => pantallas.get(sucursalId)!.delete(res))
})

router.get('/turnos', async (req, res) => {
  const { sucursalId, estado } = req.query
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS_TURNO}
     FROM turnos WHERE sucursal_id = $1 AND ($2::text IS NULL OR estado = $2)
     ORDER BY id`,
    [sucursalId, estado ?? null]
  )
  res.json(rows)
})

router.post('/turnos', async (req, res) => {
  const { tipo, sucursalId } = req.body
  // La numeración es correlativa por sucursal y tipo de atención: M-001, M-002, F-001...
  const { rows: conteo } = await pool.query(
    'SELECT count(*)::int AS cantidad FROM turnos WHERE sucursal_id = $1 AND tipo = $2',
    [sucursalId, tipo])
  const numero = `${tipo[0]}-${String(conteo[0].cantidad + 1).padStart(3, '0')}`

  const { rows } = await pool.query(
    `INSERT INTO turnos (numero, tipo, sucursal_id) VALUES ($1, $2, $3)
     RETURNING ${COLUMNAS_TURNO}`,
    [numero, tipo, sucursalId])
  const turno = rows[0]

  await Evento.create({ turnoId: turno.id, sucursalId, numero, tipo, accion: 'creado' })
  notificarCambio(sucursalId)
  res.status(201).json(turno)
})

router.patch('/turnos/:id', verificarFuncionario, async (req, res) => {
  const { estado, modulo } = req.body
  // El módulo se conserva al finalizar para que quede registrado en el historial
  const { rows } = await pool.query(
    `UPDATE turnos SET estado = COALESCE($1, estado), modulo = COALESCE($2, modulo) WHERE id = $3
     RETURNING ${COLUMNAS_TURNO}`,
    [estado ?? null, modulo ?? null, req.params.id])
  const turno = rows[0]
  if (!turno) {
    res.status(404).json({ message: 'Turno no encontrado' })
    return
  }

  await Evento.create({
    turnoId: turno.id, sucursalId: turno.sucursalId, numero: turno.numero, tipo: turno.tipo,
    accion: turno.estado === 'finalizado' ? 'finalizado' : 'llamado', modulo: turno.modulo,
  })
  notificarCambio(turno.sucursalId)
  res.json(turno)
})

// Público: la pantalla de atención solo necesita el último turno finalizado, no el historial completo
router.get('/historial/ultimo', async (req, res) => {
  const evento = await Evento.findOne(
    { accion: 'finalizado', sucursalId: Number(req.query.sucursalId) },
    { _id: 0, numero: 1, modulo: 1 }
  ).sort({ fecha: -1 })
  res.json(evento)
})

router.get('/historial', verificarFuncionario, async (req, res) => {
  const filtro: Record<string, unknown> = { accion: 'finalizado' }
  if (req.query.sucursalId) filtro.sucursalId = Number(req.query.sucursalId)
  const eventos = await Evento.find(filtro, { _id: 0, __v: 0 }).sort({ fecha: -1 }).limit(100)
  res.json(eventos)
})

export default router