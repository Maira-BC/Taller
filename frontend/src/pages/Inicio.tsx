import { Link} from "react-router-dom"
import Header from "../components/Header";
import usuario from '../assets/usuario.png'

function Inicio() {
    return (
        <>
            <Header />
            <main className="inicio">
                <img className="icono-usuario" src={usuario} alt="Icono de usuario" />
                <h2>BIENVENIDO</h2>
                <Link to="/sucursales" className="boton-continuar">
                    →
                </Link>
            </main>
        </>
    )
}

export default Inicio