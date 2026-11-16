import { Router } from 'express'
import { pool } from '../db/postgres.js'
import { notificarCambio } from './turnos.js'

const router = Router()

router.get('/modulos', async (req, res) => {
    const { sucursalId } = req.query

    const { rows } = await pool.query(
        `SELECT id, numero, sucursal_id AS "sucursalId", activo FROM modulos WHERE sucursal_id = $1 ORDER BY numero`,
        [sucursalId]
    )

    res.json(rows)
})

router.post('/modulos', async (req, res) => {
    const { numero, sucursalId } = req.body

    const { rows } = await pool.query(
        `INSERT INTO modulos (numero, sucursal_id) VALUES ($1, $2) RETURNING id, numero, sucursal_id AS "sucursalId", activo`,
        [numero, sucursalId]
    )

    notificarCambio(sucursalId)
    res.status(201).json(rows[0])
})

router.patch('/modulos/:id', async (req, res) => {
    const { numero, activo } = req.body

    const { rows } = await pool.query(
        `UPDATE modulos SET numero = COALESCE($1, numero), activo = COALESCE($2, activo) WHERE id = $3 RETURNING id, numero, sucursal_id AS "sucursalId", activo`,
        [numero ?? null, activo ?? null, req.params.id]
    )

    if (rows.length === 0) {
        res.status(404).json({ message: 'Módulo no encontrado' })
        return
    }

    notificarCambio(rows[0].sucursalId)
    res.json(rows[0])
})

router.delete('/modulos/:id', async (req, res) => {
    const { rows } = await pool.query(
        `DELETE FROM modulos WHERE id = $1 AND NOT EXISTS (SELECT 1 FROM turnos WHERE sucursal_id = modulos.sucursal_id AND modulo = modulos.numero AND estado = 'atendiendo') RETURNING id, sucursal_id AS "sucursalId"`,
        [req.params.id]
    )

    if (rows.length === 0) {
        res.status(409).json({ message: 'No se encontró el módulo o está siendo utilizado' })

        return
    }

    notificarCambio(rows[0].sucursalId)
    res.status(204).send()
})

export default router