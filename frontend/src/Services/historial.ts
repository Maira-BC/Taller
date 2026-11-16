export interface infoTurno {
    turnoId: number,
    sucursalId: number,
    numero: string;
    tipo: string;
    accion: string;
    modulo: number,
    fecha: string;
}

export async function getHistorial(sucursalId: number, token: string):Promise<infoTurno[]> {
    const res = await fetch(`/api/historial?sucursalId=${sucursalId}`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) {
        throw new Error("No se pudo cargar el historial")
    }
    const listaTurnos:  infoTurno[] = await res.json();
    return listaTurnos;
}