import { Link} from "react-router-dom"
import Header from "../components/Header";
import usuario from '../assets/usuario.png'

type InicioProps = {
    sucursal: string
    sucursalId: number | null
}

function Inicio({ sucursal, sucursalId }: InicioProps) {
    // Si la sucursal ya se eligió antes no se vuelve a pedir
    const destinoUsuario = sucursalId === null ? '/sucursales' : '/ingreso'

    return (
        <>
            <Header sucursal={sucursal} />
            <main className="inicio">
                <img className="icono-usuario" src={usuario} alt="Icono de usuario" />
                <h2>BIENVENIDO</h2>
                          <hr />

                <h3>INGRESO FUNCIONARIO</h3>
                <Link to="/login" className="boton-continuar">
                    →
                </Link>
          <hr />
                <h3>INGRESO CLIENTE</h3>
                <Link to={destinoUsuario} className="boton-continuar">
                    →
                </Link>
                {sucursalId !== null && (
                    <Link to="/sucursales" className="enlace-cambiar-sucursal">Cambiar sucursal</Link>
                )}
            </main>
        </>
    )
}

export default Inicio
