import Header from '../components/Header'
import { Link } from 'react-router-dom'
import { getHistorial } from '../Services/historial'
import { useEffect, useState } from 'react'
import type {infoTurno} from '../Services/historial'

type HistorialProps = {
    sucursal: string
}

function Historial({ sucursal }: HistorialProps) {
    const [historial, setHistorial] = useState<infoTurno[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() =>  {
     async function fetchHistorial () {
        try {
         const data = await getHistorial()
         setHistorial(data)
        }
        catch {
         setError("No se pudo cargar el historial")
        }
        finally {
         setCargando(false)
        }        
     }
     fetchHistorial()
    },[]
    )
    return (
        <>
            <Header sucursal={sucursal} />
            <main className="historial">
                <div className="contenido-historial">
                    <h2>HISTORIAL DE ATENCIÓN</h2>
                    <hr/>
                          {cargando && <p>Cargando sucursales...</p>}
          {error && <p className="mensaje-error">{error}</p>}
          {!cargando && !error && historial.length === 0 && (<p>No hay turnos registrados</p>)}
                    <ul className="lista-historial">
                        {historial.map((turno) => (
                            <li key={`${turno.sucursalId}-${turno.numero}`} className="fila-turno">
                                <span>{turno.numero}</span>
                                <span>{turno.tipo}</span>
                                <span>{turno.accion}</span>
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