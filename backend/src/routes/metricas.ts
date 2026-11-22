import { Router } from 'express'
import { Evento } from '../models/Evento.js'
import { verificarFuncionario } from '../middleware/autenticacion.js'

const router = Router()
router.get('/metricas', verificarFuncionario, async (req, res) => {
    try {
        const sucursalId = Number(req.query.sucursalId)
        if (!Number.isInteger(sucursalId) || sucursalId <= 0) {
            res.status(400).json({ message: 'Sucursal inválida '})
            return
        }

        const ahora = new Date()
        const inicioDia = new Date(ahora)
        inicioDia.setHours(0, 0, 0, 0)
        const finDia = new Date(ahora)
        finDia.setHours(23, 59, 59, 999)
        const eventos = await Evento.find({ sucursalId, fecha: { $gte: inicioDia, $lte: finDia } })
            .sort({ fecha: 1 })
            .lean()

        const eventosPorTurno = new Map<number, typeof eventos>()
        for (const evento of eventos) {
            if (typeof evento.turnoId !== 'number') continue
            const grupo = eventosPorTurno.get(evento.turnoId) ?? []
            grupo.push(evento)
            eventosPorTurno.set(evento.turnoId, grupo)
        }

        const tiemposEspera: number[] = []
        const tiemposAtencion: number[] = []
        for (const eventosTurno of eventosPorTurno.values()) {
            const creado = eventosTurno.find(e => e.accion === 'creado')
            const llamado = eventosTurno.find(e => e.accion === 'llamado')
            const finalizado = eventosTurno.find(e => e.accion === 'finalizado')
            if (creado?.fecha && llamado?.fecha) {
                const espera = (new Date(llamado.fecha).getTime() - new Date(creado.fecha).getTime()) / 60000
                if (espera >= 0) tiemposEspera.push(espera)
            }
            if (llamado?.fecha && finalizado?.fecha) {
                const atencion = (new Date(finalizado.fecha).getTime() - new Date(llamado.fecha).getTime()) / 60000
                if (atencion >= 0) tiemposAtencion.push(atencion)
            }
        }

        const calcularPromedio = (tiempos: number[]) => {
            if (tiempos.length === 0) return null
            const suma = tiempos.reduce((total, tiempo) => total + tiempo, 0)
            return Math.round((suma / tiempos.length) * 100) / 100
        }
        const promedioEspera = calcularPromedio(tiemposEspera)
        const promedioAtencion = calcularPromedio(tiemposAtencion)

        res.json({ totalEventos: eventos.length, totalTurnos: eventosPorTurno.size, turnosConEspera: tiemposEspera.length, turnosConAtencion: tiemposAtencion.length, promedioEspera, promedioAtencion })
    }
    catch(error) {
        res.status(500).json({ message: 'Error al obtener las métricas' })
    }
})

export default router