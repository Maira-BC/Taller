
export interface Sucursal {
    id: number;
    nombre: string;
    latitude: number;
    longitude: number;
}

export async function obtenerSucursales(): Promise<Sucursal[]> {
    const respuesta = await fetch('/api/sucursales');// llama directo y evita problemas de puerto 
    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener las sucursales');
    }
    return respuesta.json();
}
// Distancia en km entre dos puntos (formula de Haversine)
export function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // radio de la Tierra en km
    const toRad = (grados: number) => (grados * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function sucursalMasCercana(latitude: number, longitude: number, listaSucursales: Sucursal[]): { sucursal: Sucursal; distancia: number } | null {
    if (listaSucursales.length === 0) return null;

    let masCercana = listaSucursales[0];
    let menorDistancia = Infinity;

    for (const sucursal of listaSucursales) {
        const distancia = calcularDistancia(latitude, longitude, sucursal.latitude, sucursal.longitude);
        if (distancia < menorDistancia) {
            menorDistancia = distancia;
            masCercana = sucursal;
        }
    }

    return { sucursal: masCercana, distancia: menorDistancia };
}