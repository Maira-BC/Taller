export interface UsuarioAPI {
    id: number
    nombre: string
    correo: string
    rut: string
    token?: string
}

export interface NuevoUsuario {
    nombre: string
    correo: string
    rut: string
    contrasena: string
}

export async function iniciarSesion(correo: string, contrasena: string): Promise<UsuarioAPI> {
    const respuesta = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
    })

    // 400 llega si la contraseña no cumple el largo mínimo del spec; para el usuario es lo mismo que un 401
    if (respuesta.status === 401 || respuesta.status === 400) {
        throw new Error('Correo o contraseña incorrectos')
    }
    if (!respuesta.ok) {
        throw new Error('No se pudo iniciar sesión')
    }

    return respuesta.json()
}

export async function crearUsuario(usuario: NuevoUsuario): Promise<UsuarioAPI> {
    const respuesta = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    })

    if (respuesta.status === 409) {
        throw new Error('El correo o RUT ya está registrado')
    }
    if (!respuesta.ok) {
        throw new Error('No se pudo crear el usuario')
    }

    return respuesta.json()
}
