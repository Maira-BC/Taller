import { Router } from 'express'
import { pool } from '../db/postgres.js'
import bcrypt from 'bcryptjs'
import { formatearRut, validarRut } from '../utils/rut.js'

const router = Router()
const SALT_ROUNDS = 10

router.post("/usuarios", async (req, res) => {
    const {nombre, correo, rut, contrasena } = req.body
    if (!validarRut(rut)) {
        res.status(400).json({ message: 'RUT inválido' })
        return
    }
    const contrasenaHash = await bcrypt.hash(contrasena, SALT_ROUNDS)
    try {
        const { rows } = await pool.query (
            `INSERT INTO usuarios (nombre, correo, rut, contrasena_hash) VALUES ($1, $2, $3, $4)
            RETURNING id, nombre, correo, rut`,
            [nombre, correo, formatearRut(rut), contrasenaHash])
        res.status(201).json(rows[0])
    }
    catch(err:any) {
      if (err.code === '23505') {
      res.status(409).json({ message: 'El correo/rut ya está registrado' })
      return
      }
      throw err
    }
})

router.post("/login", async (req, res) => {
    const  {correo, contrasena} = req.body
    const {rows} = await pool.query(
        'SELECT id, nombre, correo, rut, contrasena_hash FROM usuarios WHERE correo = $1', [correo])
    const usuario = rows[0]
    const valido = usuario && await bcrypt.compare(contrasena, usuario.contrasena_hash)
    if (!valido) {
    res.status(401).json({message:"Correo o contraseña incorrectos"})
    return
    }
    const {contrasena_hash, ...datos } = usuario
    res.json(datos)

})

export default router
