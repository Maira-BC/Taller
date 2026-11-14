export interface TurnoAPI {
    id: number
    numero: string
    tipo: string
    estado: string
    modulo: string | null
    sucursalId: number
}

export async function crearTurno(tipo: string, sucursalId: number): Promise<TurnoAPI> {
    const respuesta = await fetch(`http://localhost:3000/api/turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, sucursalId })
    })

    if (!respuesta.ok) {
        throw new Error('No se pudo generar el turno')
    }

    return respuesta.json()
}