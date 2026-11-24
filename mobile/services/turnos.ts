const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Turno {
  id: number;
  numero: string;
  tipo: string;
  estado: string;
  modulo: number | null;
  sucursalId: number;
}

export async function solicitarTurno(tipo: string, sucursalId: number): Promise<Turno> {
  if (!API_URL) {
    throw new Error('No se configuró la dirección de la API');
  }

  const respuesta = await fetch(`${API_URL}/turnos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify({ tipo, sucursalId, }),
    });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();

    console.log('Estado HTTP:', respuesta.status);
    console.log('Respuesta del servidor:', detalle);

    throw new Error('No se pudo solicitar el turno');
  }

  return respuesta.json();
}


export async function obtenerTurnos(sucursalId: number): Promise<Turno[]> {
  if (!API_URL) {
    throw new Error('No se configuró la dirección de la API');
  }

  const respuesta = await fetch(`${API_URL}/turnos?sucursalId=${sucursalId}`, {
      signal: AbortSignal.timeout(10000),
    });

  if (!respuesta.ok) {
    throw new Error('No se pudieron consultar los turnos');
  }

  return respuesta.json();
}