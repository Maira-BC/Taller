import { Router } from 'express'
import { pool } from '../db/postgres.js'

const router = Router()

router.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT id, nombre, latitude, longitude FROM sucursales ORDER BY id')
  res.json(rows)
})

export default router
