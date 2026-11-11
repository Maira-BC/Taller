import { Link } from 'react-router-dom'
import Header from '../components/Header'

type IngresoProps = {
  sucursal: string
}

function Ingreso({ sucursal }: IngresoProps) {
  return (
    <>
      <Header sucursal={sucursal} />
      <main className="ingreso">
        <Link to="/rut" className="boton-ingreso">
            INGRESO
            <span>RUT</span>
        </Link>
        <Link to="/turno" className="boton-ingreso">
            INGRESO
            <span>SIN RUT</span>
        </Link>
      </main>
    </>
  )
}

export default Ingreso