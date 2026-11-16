import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function verificarFuncionario(
    req: Request,
    res: Response,
    next: NextFunction
)

{
    const autorizacion = req.headers.authorization

    if (!autorizacion?.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Autenticación requerida' })
        return
    }

    const token = autorizacion.slice(7)
    const secreto = process.env.JWT_SECRET

    if (!secreto) {
        res.status(500).json({ message: 'Error de configuración del servidor' })
        return
    }

    try {
        const datos = jwt.verify(token, secreto)

        if (
            typeof datos === 'string' ||
            typeof datos.id !== 'number' ||
            datos.tipo !== 'funcionario'
        )

        {
            res.status(403).json({ message: 'Acceso no autorizado' })
            return
        }

        next()
    }

    catch {
        res.status(401).json({ message: 'Sesión inválida o expirada' })
    }
}