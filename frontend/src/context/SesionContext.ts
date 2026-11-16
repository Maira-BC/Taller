import { createContext, useContext } from 'react'
import type { UsuarioAPI } from '../Services/Usuarios'

type Sesion = {
    funcionario: UsuarioAPI | null
    cerrarSesion: () => void
}

// Comparte el funcionario con sesión iniciada con cualquier componente (por ejemplo, el Header)
export const SesionContext = createContext<Sesion>({ funcionario: null, cerrarSesion: () => {} })

export function useSesion() {
    return useContext(SesionContext)
}
