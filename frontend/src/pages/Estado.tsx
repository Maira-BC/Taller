import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { obtenerTurnos, actualizarTurno, type TurnoAPI } from '../Services/Turnos'

type EstadoProps = {
    sucursal: string
    sucursalId: number | null
}

function Estado({ sucursal, sucursalId }: EstadoProps) {
    const navigate = useNavigate()
    const modulos = [1, 2, 3, 4, 5]
    const [mensaje, setMensaje] = useState('')
    const [turnosAPI, setTurnosAPI] = useState<TurnoAPI[]>([])
    const [cargando, setCargando] = useState(sucursalId !== null)

    useEffect(() => {
        if (sucursalId === null) {
            return
        }

        async function cargarTurnos() {
            try {
                const datos = await obtenerTurnos(sucursalId!)
                setTurnosAPI(datos)
            }
            catch {
                setMensaje('No se pudieron cargar los turnos.')
            }
            finally {
                setCargando(false)
            }
        }

        cargarTurnos()
    }, [sucursalId])

    const VolverARegistro = () => {
        navigate('/Turno')
    }

    const turnosEnEspera = turnosAPI.filter(
        (turno) => turno.estado === 'espera'
    )
    const turnosAtendidos = turnosAPI.filter(
        (turno) =>
            turno.estado === 'finalizado'
    )

    const modulosLibres = modulos.filter((numeroModulo) => {
        return !turnosAPI.some(
            (turno) =>
                turno.modulo === numeroModulo &&
                turno.estado === 'atendiendo'
        )
    })

    const llamarSiguiente = async () => {
        if (turnosEnEspera.length === 0) {
            setMensaje('No hay turnos en espera.')
            return
        }
        if (modulosLibres.length === 0) {
            setMensaje('No hay módulos disponibles.')
            return
        }

        const moduloElegido = modulosLibres[0]
        const siguienteTurno = turnosEnEspera[0]

        try {
            const turnoActualizado = await actualizarTurno(
                siguienteTurno.id,
                'atendiendo',
                moduloElegido
            )

            setTurnosAPI(turnosAPI.map((turno) =>
                turno.id === turnoActualizado.id ? turnoActualizado : turno
            ))

            setMensaje('')
        }

        catch {
            setMensaje('No se pudo llamar al siguiente turno.')
        }
    }

    const finalizarTurno = async (id: number) => {
        try {
            const turnoFinalizado = await actualizarTurno(
                id,
                'finalizado',
                null
            )

            setTurnosAPI(turnosAPI.map((turno) =>
                turno.id === turnoFinalizado.id ? turnoFinalizado : turno
            ))

            setMensaje('')
        }

        catch {
            setMensaje('No se pudo finalizar el turno.')
        }
    }

    return (
        <>
            <Header sucursal={sucursal} />
            <main className="estado">
                <div className="contenido-estado">
                    <h2>ESTADO DE ATENCIÓN</h2>
                    <hr />
                    {cargando && <p>Cargando turnos...</p>}
                    <h3>Módulos de atención</h3>
                    <div className="modulos">
                        {modulos.map((numeroModulo) => {
                            const turnoModulo = turnosAPI.find(
                                (turno) =>
                                    turno.modulo === numeroModulo &&
                                    turno.estado === 'atendiendo'
                            )

                            return (
                                <div className="modulo" key={numeroModulo}>
                                    <h4>Módulo {numeroModulo}</h4>
                                    {turnoModulo ? (
                                        <>
                                            <p className="numero-modulo">{turnoModulo.numero}</p>
                                            <p>Atención: {turnoModulo.tipo}</p>
                                            <p>En atención</p>
                                            <button type="button" className="boton-finalizar" onClick={() => finalizarTurno(turnoModulo.id)}>FINALIZAR</button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="numero-modulo">---</p>
                                            <p>Atención: ---</p>
                                            <p>Libre</p>
                                        </>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <h3>Siguientes turnos</h3>
                    <ul className="lista-espera">
                        {turnosEnEspera.map((turno) => (
                            <li key={turno.id} className="fila-turno">
                                <span>{turno.numero}</span>
                                <span>{turno.tipo}</span>
                                <span>{turno.estado === 'espera' ? 'En espera' : turno.estado}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="indicadores">
                        <p>En espera: {turnosEnEspera.length}</p>
                        <p>Atendidos: {turnosAtendidos.length}</p>
                    </div>
                    <div className="acciones-estado">
                        <button type="button" className="boton-llamar" onClick={llamarSiguiente} disabled={cargando}>LLAMAR SIGUIENTE</button>
                         <button type="button" className="boton-llamar" onClick={VolverARegistro}>
                         AÑADIR TURNO</button>
                        <Link to="/historial" className="boton-historial" aria-label="Ver historial">◷</Link>
                    </div>
                    {mensaje && (<p className="mensaje-estado">{mensaje}</p>)}
                </div>
            </main>
        </>
    )
}

export default Estado