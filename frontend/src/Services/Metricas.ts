export interface Metricas {
    totalEventos: number
    totalTurnos: number
    turnosConEspera: number
    turnosConAtencion: number
    promedioEspera: number | null
    promedioAtencion: number | null
}

export async function getMetricas(sucursalId: number, token: string):Promise<Metricas> {
    const res = await fetch(`/api/metricas?sucursalId=${sucursalId}`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) {
        throw new Error('No se pudieron cargar las métricas')
    }

    const metricas: Metricas = await res.json()
    return metricas
}