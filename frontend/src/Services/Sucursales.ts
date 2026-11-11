
export interface Sucursal {
    id: number;
    nombre: string;
    latitude: number;
    longitude: number;
}

// Coordenadas aproximadas del centro de cada comuna
export const sucursales: Sucursal[] = [
    { id: 1, nombre: 'Concón', latitude: -32.9230, longitude: -71.5190 },
    { id: 2, nombre: 'Viña del Mar', latitude: -33.0245, longitude: -71.5518 },
    { id: 3, nombre: 'Valparaíso', latitude: -33.0472, longitude: -71.6127 },
    { id: 4, nombre: 'Quilpué', latitude: -33.0479, longitude: -71.4425 },
    { id: 5, nombre: 'Villa Alemana', latitude: -33.0422, longitude: -71.3733 },
];

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

export function sucursalMasCercana(latitude: number, longitude: number): { sucursal: Sucursal; distancia: number } {
    let masCercana = sucursales[0];
    let menorDistancia = Infinity;

    for (const sucursal of sucursales) {
        const distancia = calcularDistancia(latitude, longitude, sucursal.latitude, sucursal.longitude);
        if (distancia < menorDistancia) {
            menorDistancia = distancia;
            masCercana = sucursal;
        }
    }

    return { sucursal: masCercana, distancia: menorDistancia };
}