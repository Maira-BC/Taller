export interface Sucursal {
    id: number;
    nombre: string;
    latitude: number;
    longitude: number;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function obtenerSucursales(): Promise<Sucursal[]> {
    if (!API_URL) {
        throw new Error('No se configuró la dirección de la API');
    }

    const respuesta = await fetch(`${API_URL}/sucursales`);

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener las sucursales');
    }

    return respuesta.json();
}