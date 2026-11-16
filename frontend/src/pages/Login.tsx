import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { iniciarSesion, type UsuarioAPI } from '../Services/Usuarios'

type LoginProps = {
  sucursal: string
  sucursalId: number | null
  setFuncionario: (funcionario: UsuarioAPI) => void
}

export default function Login({ sucursal, sucursalId, setFuncionario }: LoginProps) {
    const [correo, setCorreo] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [error, setError] = useState('')
    const [enviando, setEnviando] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setEnviando(true)
        setError('')

        try {
            const funcionario = await iniciarSesion(correo, contrasena)
            setFuncionario(funcionario)
            // Si la sucursal ya se eligió antes no se vuelve a pedir
            navigate(sucursalId === null ? '/sucursales' : '/estado')
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión')
        }
        finally {
            setEnviando(false)
        }
    }

    return (
        <>
            <Header sucursal={sucursal} />
            <main className="login">
                <div className="contenido-login">
                    <h2>INICIAR SESIÓN</h2>
                    <hr />
                    <form className="formulario-cuenta" onSubmit={handleSubmit}>
                        <label htmlFor="correo">Correo:</label>
                        <input type="email" id="correo" className="form-control" value={correo} onChange={(event) => setCorreo(event.target.value)} required />
                        <label htmlFor="contrasena">Contraseña:</label>
                        <input type="password" id="contrasena" className="form-control" value={contrasena} onChange={(event) => setContrasena(event.target.value)} required />
                        {error && <p className="mensaje-error">{error}</p>}
                        <button type="submit" className="boton-cuenta" disabled={enviando}>
                            {enviando ? 'Ingresando...' : 'INGRESAR'}
                        </button>
                        <Link to="/registro" className="enlace-cuenta">Crear usuario</Link>
                    </form>
                    <Link to="/" className="boton-continuar boton-volver-cuenta" aria-label="Volver al inicio">←</Link>
                </div>
            </main>
        </>
    )
}
