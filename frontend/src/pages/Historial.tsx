import Header from '../components/Header'
import { Link } from 'react-router-dom'
import { getHistorial } from '../Services/historial'
import { useEffect, useState } from 'react'
import type {infoTurno} from '../Services/historial'
import { useSesion } from '../context/SesionContext'

type HistorialProps = {
    sucursal: string
    sucursalId: number | null
}

function Historial({ sucursal, sucursalId }: HistorialProps) {
    const { funcionario } = useSesion()
    const token = funcionario?.token

    const [historial, setHistorial] = useState<infoTurno[]>([]);
    const [cargando, setCargando] = useState<boolean>(sucursalId !== null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() =>  {
     if (sucursalId === null) {
        return
     }

     async function fetchHistorial () {
        try {
            if (!token) {
                setError('Debes iniciar sesión como funcionario')
                setCargando(false)
                return
            }

            const data = await getHistorial(sucursalId!, token)
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
    },[sucursalId, token]
    )
    return (
        <>
            <Header sucursal={sucursal} />
            <main className="historial">
                <div className="contenido-historial">
                    <h2>HISTORIAL DE ATENCIÓN</h2>
                    <hr/>
          {cargando && <p>Cargando historial...</p>}
          {error && <p className="mensaje-error">{error}</p>}
          {!cargando && !error && historial.length === 0 && (<p>No hay turnos registrados</p>)}
                    <ul className="lista-historial">
                        {historial.map((turno) => (
                            <li key={turno.turnoId} className="fila-turno">
                                <span>{turno.numero}</span>
                                <span>{turno.tipo}</span>
                                <span>{turno.accion === 'finalizado' ? 'Finalizado' : turno.accion}</span>
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