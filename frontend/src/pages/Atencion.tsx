import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { obtenerTurnos, type TurnoAPI } from '../Services/Turnos'
import { getHistorial, type infoTurno } from '../Services/historial'
import { obtenerModulos, type ModuloAPI } from '../Services/Modulos'
import { useSesion } from '../context/SesionContext'

type AtencionProps = {
    sucursal: string
    sucursalId: number | null
}

function Atencion({ sucursal, sucursalId }: AtencionProps) {
    const { funcionario } = useSesion()
    const token = funcionario?.token

    const [modulos, setModulos] = useState<ModuloAPI[]>([])
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
                if (!token) {
                    setError('Debes iniciar sesión como funcionario')
                    return
                }

                const [datosTurnos, historial, datosModulos] = await Promise.all([
                    obtenerTurnos(sucursalId!),
                    getHistorial(sucursalId!, token),
                    obtenerModulos(sucursalId!)
                ])
                setTurnos(datosTurnos)
                setModulos(datosModulos)
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

        // El backend avisa cada vez que cambia un turno o un módulo de la sucursal
        const eventos = new EventSource(`/api/eventos?sucursalId=${sucursalId}`)
        eventos.onmessage = cargarTurnos
        return () => eventos.close()
    }, [sucursalId, token])

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
                        {modulos.map((modulo) => {
                            const turnoActual = turnos.find(
                                (turno) =>
                                    turno.modulo === modulo.numero &&
                                    turno.estado === 'atendiendo'
                            )
                            // Los módulos inactivos no se muestran, salvo que aún estén terminando una atención
                            if (!modulo.activo && !turnoActual) return null

                            return (
                                <div className="modulo" key={modulo.id}>
                                    <h4>Módulo {modulo.numero}</h4>
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
