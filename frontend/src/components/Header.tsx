import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useSesion } from '../context/SesionContext'

type HeaderProps = {
    sucursal?: string
}

function Header({ sucursal }: HeaderProps) {
    const { funcionario, cerrarSesion } = useSesion()
    const navigate = useNavigate()

    const salir = () => {
        cerrarSesion()
        navigate('/')
    }

    return (
        <header className="header">
            <img src={logo} alt="Logo" />
            <div className="header-texto">
                <h1>Sistema de atención y gestión de turnos</h1>
                {sucursal && <p>{sucursal}</p>}
            </div>
            {funcionario && (
                <div className="sesion-header">
                    <span className="nombre-funcionario">{funcionario.nombre}</span>
                    <button type="button" className="boton-cerrar-sesion" onClick={salir}>Cerrar sesión</button>
                    <Link to="/registro" className="boton-cerrar-sesion">Registrar funcionario</Link>
                </div>
            )}
        </header>
    )
}

export default Header
