// Obtiene la comuna y region a partir de coordenadas usando Nominatim (OpenStreetMap)

export interface Comuna {
    comuna: string;
    region: string;
}

export async function obtenerComuna(latitude: number, longitude: number, signal?: AbortSignal): Promise<Comuna> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=es`;
    const res = await fetch(url, { signal });
    if (!res.ok) {
        throw new Error(`Error al consultar OpenStreetMap (${res.status})`);
    }
    const data = await res.json();
    const a = data.address ?? {};

    return {
        comuna: a.city || a.town || a.village || a.municipality || a.suburb || 'Desconocida',
        region: a.state || '',
    };
}