export interface ModuloAPI {
    id: number
    numero: number
    sucursalId: number
    activo: boolean
}

export async function obtenerModulos(sucursalId: number): Promise<ModuloAPI[]> {
    const respuesta = await fetch(`/api/modulos?sucursalId=${sucursalId}`)

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener los módulos')
    }

    return respuesta.json()
}

export async function actualizarModulo(id: number, cambios: { activo?: boolean; numero?: number }): Promise<ModuloAPI> {
    const respuesta = await fetch(`/api/modulos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cambios)
    })

    if (!respuesta.ok) {
        throw new Error('No se pudo actualizar el módulo')
    }

    return respuesta.json()
}

export async function crearModulo(numero: number, sucursalId: number): Promise<ModuloAPI> {
    const respuesta = await fetch(`/api/modulos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero, sucursalId })
    })

    if (!respuesta.ok) {
        throw new Error('No se pudo crear el módulo')
    }

    return respuesta.json()
}

export async function eliminarModulo(id: number): Promise<void> {
    const respuesta = await fetch(`/api/modulos/${id}`, {
        method: 'DELETE'
    })

    if (!respuesta.ok) {
        throw new Error('No se pudo eliminar el módulo')
    }
}