export interface TurnoAPI {
    id: number
    numero: string
    tipo: string
    estado: string
    modulo: number | null
    sucursalId: number
}

export async function crearTurno(tipo: string, sucursalId: number): Promise<TurnoAPI> {
    const respuesta = await fetch(`/api/turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, sucursalId })
    })

    if (!respuesta.ok) {
        throw new Error('No se pudo generar el turno')
    }

    return respuesta.json()
}

export async function obtenerTurnos(sucursalId: number): Promise<TurnoAPI[]> {
    const respuesta = await fetch(`/api/turnos?sucursalId=${sucursalId}`)

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener los turnos')
    }

    return respuesta.json()
}

export async function actualizarTurno(id: number, estado: string, modulo: number | null): Promise<TurnoAPI> {
    const respuesta = await fetch(`/api/turnos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado, modulo })
    })

    if (!respuesta.ok) {
        throw new Error('No se pudo actualizar el turno')
    }

    return respuesta.json()
}