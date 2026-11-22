import Header from '../components/Header'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSesion } from '../context/SesionContext'
import { getMetricas } from '../Services/Metricas'
import type { Metricas as DatosMetricas } from '../Services/Metricas'

type MetricasProps = {
    sucursal: string
    sucursalId: number | null
}

function Metricas({ sucursal, sucursalId }: MetricasProps) {
    const { funcionario } = useSesion()
    const token = funcionario?.token

    const [metricas, setMetricas] = useState<DatosMetricas | null>(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelado = false

        async function cargarMetricas() {
            if (sucursalId === null || !token) {
                return
            }

            try {
                const datos = await getMetricas(sucursalId!, token)

                if (!cancelado) {
                    setMetricas(datos)
                    setError(null)
                }
            }

            catch {
                if (!cancelado) {
                    setError('No se pudieron cargar las métricas')
                }
            }
            finally {
                if (!cancelado) {
                    setCargando(false)
                }
            }
        }

        void cargarMetricas()
        return () => {
            cancelado = true
        }
    }, [sucursalId, token])

    return (
        <>
            <Header sucursal={sucursal} />
            <main className="historial">
                <div className="contenido-historial">
                    <h2>MÉTRICAS DE ATENCIÓN</h2>
                    <hr />
                    <p>Estadísticas de la jornada actual</p>
                    {cargando && <p>Cargando métricas...</p>}
                    {error && <p className="mensaje-error">{error}</p>}
                    {!cargando && !error && metricas && (
                        <div className="resumen-metricas">
                            <div className="tarjeta-metrica">
                                <h3>Tiempo promedio de espera</h3>
                                <p>
                                    {metricas.promedioEspera !== null ? `${metricas.promedioEspera} minutos` : 'Sin datos disponibles'}
                                </p>
                            </div>
                            <div className="tarjeta-metrica">
                                <h3>Tiempo promedio de atención</h3>
                                <p>
                                    {metricas.promedioAtencion !== null ? `${metricas.promedioAtencion} minutos` : 'Sin datos disponibles'}
                                </p>
                            </div>
                            <div className="tarjeta-metrica">
                                <h3>Turnos registrados hoy</h3>
                                <p>{metricas.totalTurnos}</p>
                            </div>
                            <div className="tarjeta-metrica">
                                <h3>Turnos con espera registrada</h3>
                                <p>{metricas.turnosConEspera}</p>
                            </div>
                            <div className="tarjeta-metrica">
                                <h3>Turnos con atención registrada</h3>
                                <p>{metricas.turnosConAtencion}</p>
                            </div>
                        </div>
                    )}
                    <Link to="/estado" className="boton-continuar boton-volver-historial" aria-label="Volver al estado de atención">←</Link>
                </div>
            </main>
        </>
    )
}

export default Metricas