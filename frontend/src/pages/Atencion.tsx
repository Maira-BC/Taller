import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { obtenerTurnos, type TurnoAPI } from '../Services/Turnos'
import { getHistorial, type infoTurno } from '../Services/historial'

type AtencionProps = {
    sucursal: string
    sucursalId: number | null
}

function Atencion({ sucursal, sucursalId }: AtencionProps) {
    const modulos = [1, 2, 3, 4, 5]
    const [turnos, setTurnos] = useState<TurnoAPI[]>([])
    const [anterior, setAnterior] = useState<infoTurno | null>(null)
    const [cargando, setCargando] = useState(sucursalId !== null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (sucursalId === null) {
            return
        }

        async function cargarTurnos() {
            try {
                const [datosTurnos, historial] = await Promise.all([
                    obtenerTurnos(sucursalId!),
                    getHistorial(sucursalId!)
                ])
                setTurnos(datosTurnos)
                // El historial viene ordenado del más reciente al más antiguo
                setAnterior(historial[0] ?? null)
                setError('')
            }
            catch {
                setError('No se pudieron cargar los turnos.')
            }
            finally {
                setCargando(false)
            }
        }

        cargarTurnos()

        // El backend avisa cada vez que un funcionario llama, finaliza o se genera un turno
        const eventos = new EventSource(`/api/eventos?sucursalId=${sucursalId}`)
        eventos.onmessage = cargarTurnos
        return () => eventos.close()
    }, [sucursalId])

    const siguiente = turnos.find((turno) => turno.estado === 'espera')

    return (
        <>
            <Header sucursal={sucursal} />
            <main className="atencion">
                <div className="contenido-atencion">
                    <h2>TURNOS EN ATENCIÓN</h2>
                    <hr />
                    {cargando && <p className="mensaje-estado">Cargando turnos...</p>}
                    {error && <p className="mensaje-error">{error}</p>}
                    <h3>Atendiendo ahora</h3>
                    <div className="modulos">
                        {modulos.map((numeroModulo) => {
                            const turnoActual = turnos.find(
                                (turno) =>
                                    turno.modulo === numeroModulo &&
                                    turno.estado === 'atendiendo'
                            )

                            return (
                                <div className="modulo" key={numeroModulo}>
                                    <h4>Módulo {numeroModulo}</h4>
                                    <p className="numero-modulo">{turnoActual?.numero ?? '---'}</p>
                                </div>
                            )
                        })}
                    </div>
                    <div className="turnos-contiguos">
                        <div className="turno-contiguo">
                            <h3>Anterior</h3>
                            <p className="numero-contiguo">{anterior?.numero ?? '---'}</p>
                            {anterior?.modulo && <p>Módulo {anterior.modulo}</p>}
                        </div>
                        <div className="turno-contiguo">
                            <h3>Siguiente</h3>
                            <p className="numero-contiguo">{siguiente?.numero ?? '---'}</p>
                            {siguiente && <p>En espera</p>}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Atencion
