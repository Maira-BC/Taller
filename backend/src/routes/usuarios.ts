import { Router } from 'express'
import { pool } from '../db/postgres.js'
import bcrypt from 'bcryptjs'

const router = Router()
const SALT_ROUNDS = 10

router.post("/usuarios", async (req, res) => {
    const {nombre, correo, rut, password } = req.body
    

})