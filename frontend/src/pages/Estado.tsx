import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import type { Turno as TurnoData } from '../data/turnos'

type EstadoProps = {
    sucursal: string
    turnos: TurnoData[]
    setTurnos: (turnos: TurnoData[]) => void
}

function Estado({ sucursal, turnos, setTurnos }: EstadoProps) {
    const navigate = useNavigate()
    const modulos = [1, 2, 3, 4, 5]
    const [mensaje, setMensaje] = useState('')

    const VolverARegistro = () => {
        navigate('/Turno')
    }

    const turnosEnEspera = turnos.filter(
        (turno) => turno.estado === 'En espera' && turno.sucursal === sucursal
    )
    const turnosAtendidos = turnos.filter(
        (turno) =>
            turno.estado === 'Atendido' && turno.sucursal === sucursal
    )

    const modulosLibres = modulos.filter((numeroModulo) => {
        return !turnos.some(
            (turno) =>
                turno.modulo === numeroModulo &&
                turno.estado === 'En atención' &&
                turno.sucursal === sucursal
        )
    })

    const llamarSiguiente = () => {
        if (turnosEnEspera.length === 0) {
            setMensaje('No hay turnos en espera.')
            return
        }
        if (modulosLibres.length === 0) {
            setMensaje('No hay módulos disponibles.')
            return
        }

        setMensaje('')

        const posicionAleatoria = Math.floor(
            Math.random() * modulosLibres.length
        )

        const moduloElegido = modulosLibres[posicionAleatoria]
        const siguienteTurno = turnosEnEspera[0]

        const turnosActualizados = turnos.map((turno) => {
            if (turno.numero === siguienteTurno.numero && turno.sucursal === sucursal) {
                return {
                    ...turno,
                    estado: 'En atención',
                    modulo: moduloElegido
                }
            }

            return turno
        })

        setTurnos(turnosActualizados)
    }

    const finalizarTurno = (numeroTurno:string) => {
        setMensaje('')
        const turnosActualizados = turnos.map((turno) => {
            if (turno.numero === numeroTurno && turno.sucursal === sucursal) {
                return {
                    ...turno,
                    estado: 'Atendido',
                    modulo: null
                }
            }

            return turno
        })

        setTurnos(turnosActualizados)
    }

    return (
        <>
            <Header sucursal={sucursal} />
            <main className="estado">
                <div className="contenido-estado">
                    <h2>ESTADO DE ATENCIÓN</h2>
                    <hr />
                    <h3>Módulos de atención</h3>
                    <div className="modulos">
                        {modulos.map((numeroModulo) => {
                            const turnoModulo = turnos.find(
                                (turno) =>
                                    turno.modulo === numeroModulo &&
                                    turno.estado === 'En atención' &&
                                    turno.sucursal === sucursal
                            )

                            return (
                                <div className="modulo" key={numeroModulo}>
                                    <h4>Módulo {numeroModulo}</h4>
                                    {turnoModulo ? (
                                        <>
                                            <p className="numero-modulo">{turnoModulo.numero}</p>
                                            <p>Atención: {turnoModulo.tipo}</p>
                                            <p>En atención</p>
                                            <button type="button" className="boton-finalizar" onClick={() => finalizarTurno(turnoModulo.numero)}>FINALIZAR</button>
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
                            <li key={`${turno.sucursal}-${turno.numero}`} className="fila-turno">
                                <span>{turno.numero}</span>
                                <span>{turno.tipo}</span>
                                <span>{turno.estado}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="indicadores">
                        <p>En espera: {turnosEnEspera.length}</p>
                        <p>Atendidos: {turnosAtendidos.length}</p>
                    </div>
                    <div className="acciones-estado">
                        <button type="button" className="boton-llamar" onClick={llamarSiguiente}>LLAMAR SIGUIENTE</button>
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