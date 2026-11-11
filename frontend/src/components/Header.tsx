import logo from '../assets/logo.png'

type HeaderProps = {
    sucursal?: string
}

function Header({ sucursal }: HeaderProps) {
    return (
        <header className="header">
            <img src={logo} alt="Logo" />
            <div className="header-texto">
                <h1>Sistema de atención y gestión de turnos</h1>
                {sucursal && <p>{sucursal}</p>}
            </div>
        </header>
    )
}

export default Header