import { Router } from 'express'
import { pool } from '../db/postgres.js'
import { Evento } from '../models/Evento.js'

const router = Router()

const COLUMNAS_TURNO = 'id, numero, tipo, estado, modulo, sucursal_id AS "sucursalId"'

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
  res.status(201).json(turno)
})

router.patch('/turnos/:id', async (req, res) => {
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
  res.json(turno)
})

router.get('/historial', async (req, res) => {
  const filtro = req.query.sucursalId ? { sucursalId: Number(req.query.sucursalId) } : {}
  const eventos = await Evento.find(filtro, { _id: 0, __v: 0 }).sort({ fecha: -1 }).limit(100)
  res.json(eventos)
})

export default router
