import { useState, useContext, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { crearUsuario } from '../Services/Usuarios'
import { formatearRut, validarRut } from '../utils/rut'
import { SesionContext } from '../context/SesionContext'

type RegistroProps = {
  sucursal: string
}

function Registro({ sucursal }: RegistroProps) {
    const { funcionario } = useContext(SesionContext)

    const [nombre, setNombre] = useState('')
    const [correo, setCorreo] = useState('')
    const [rut, setRut] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [confirmacion, setConfirmacion] = useState('')
    const [error, setError] = useState('')
    const [usuarioCreado, setUsuarioCreado] = useState('')
    const [enviando, setEnviando] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setUsuarioCreado('')

        if (!validarRut(rut)) {
            setError('Ingrese un RUT válido')
            return
        }
        if (contrasena.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres')
            return
        }
        if (contrasena !== confirmacion) {
            setError('Las contraseñas no coinciden')
            return
        }

        setEnviando(true)
        setError('')

        try {
            if (!funcionario?.token) {
                setError('Debes iniciar sesión como funcionario')
                return
            }
            const usuario = await crearUsuario(
                { nombre, correo, rut, contrasena },
                funcionario.token
            )
            setUsuarioCreado(usuario.nombre)
            setNombre('')
            setCorreo('')
            setRut('')
            setContrasena('')
            setConfirmacion('')
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo crear el usuario')
        }
        finally {
            setEnviando(false)
        }
    }

    return (
        <>
            <Header sucursal={sucursal} />
            <main className="registro">
                <div className="contenido-registro">
                    <h2>REGISTRAR FUNCIONARIO</h2>
                    <hr />
                    <form className="formulario-cuenta" onSubmit={handleSubmit}>
                        <label htmlFor="nombre">Nombre:</label>
                        <input type="text" id="nombre" className="form-control" value={nombre} onChange={(event) => setNombre(event.target.value)} required />
                        <label htmlFor="correo">Correo:</label>
                        <input type="email" id="correo" className="form-control" value={correo} onChange={(event) => setCorreo(event.target.value)} required />
                        <label htmlFor="rut">RUT:</label>
                        <input type="text" id="rut" className="form-control" value={rut} onChange={(event) => setRut(formatearRut(event.target.value))} maxLength={10} placeholder="12345678-5" required />
                        <label htmlFor="contrasena">Contraseña:</label>
                        <input type="password" id="contrasena" className="form-control" value={contrasena} onChange={(event) => setContrasena(event.target.value)} required />
                        <label htmlFor="confirmacion">Confirmar contraseña:</label>
                        <input type="password" id="confirmacion" className="form-control" value={confirmacion} onChange={(event) => setConfirmacion(event.target.value)} required />
                        {error && <p className="mensaje-error">{error}</p>}
                        {usuarioCreado && <p className="mensaje-exito">Usuario {usuarioCreado} creado correctamente</p>}
                        <button type="submit" className="boton-cuenta" style={{ minWidth: '260px', whiteSpace: 'nowrap' }} disabled={enviando}>
                            {enviando ? 'Creando...' : 'REGISTRAR FUNCIONARIO'}
                        </button>
                    </form>
                    <Link to="/estado" className="boton-continuar boton-volver-cuenta" aria-label="Volver a gestión de turnos">←</Link>
                </div>
            </main>
        </>
    )
}

export default Registro
