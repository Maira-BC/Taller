import Header from '../components/Header'
import { Link } from 'react-router-dom'
import type { Turno as TurnoData } from '../data/turnos'

type HistorialProps = {
    sucursal: string
    turnos: TurnoData[]
}

function Historial({ sucursal, turnos }: HistorialProps) {
    const turnosAtendidos = turnos.filter(
        (turno) => turno.estado === 'Atendido' && turno.sucursal === sucursal
    )

    return (
        <>
            <Header sucursal={sucursal} />
            <main className="historial">
                <div className="contenido-historial">
                    <h2>HISTORIAL DE ATENCIÓN</h2>
                    <hr />
                    <ul className="lista-historial">
                        {turnosAtendidos.map((turno) => (
                            <li key={`${turno.sucursal}-${turno.numero}`} className="fila-turno">
                                <span>{turno.numero}</span>
                                <span>{turno.tipo}</span>
                                <span>{turno.estado}</span>
                            </li>
                        ))}
                    </ul>
                    <Link to="/estado" className="boton-continuar boton-volver-historial" aria-label="Volver al estado de atención">←</Link>
                </div>
            </main>
        </>
    )
}

export default Historial