import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { tiposAtencion, type Turno as TurnoData } from '../data/turnos'
import { crearTurno } from '../Services/Turnos'

type TurnoProps = {
  sucursal: string
  sucursalId: number | null
  agregarTurno: (nuevoTurno: TurnoData) => void
}

function Turno({ sucursal, sucursalId, agregarTurno }: TurnoProps) {
  const [tipoAtencion, setTipoAtencion] = useState('')
  const [turnoGenerado, setTurnoGenerado] = useState('')
  const [error, setError] = useState('')
  const [generando, setGenerando] = useState(false)

  const generarTurno = async () => {
    if (tipoAtencion === '') {
      setError('Seleccione un tipo de atención')
      return
    }
    if (sucursalId === null) {
      setError('Seleccione una sucursal primero')
      return
    }

    setGenerando(true)
    setError('')
    setTurnoGenerado('')

    try {
      const turno = await crearTurno(tipoAtencion, sucursalId)
      const nuevoTurno: TurnoData = {
        numero: turno.numero,
        tipo: turno.tipo,
        estado: 'En espera',
        sucursal: sucursal,
        modulo: null
      }
      agregarTurno(nuevoTurno)
      setTurnoGenerado(turno.numero)
    }

    catch {
      setError('No se pudo generar el turno')
    }
    finally {
      setGenerando(false)
    }
  }

  return (
    <>
      <Header sucursal={sucursal} />
      <main className="turno">
        <div className="contenido-turno">
          <h2>OBTENER TURNO</h2>
          <hr />
          <div className="seleccion-turno">
            <label htmlFor="tipo-atencion">
              Tipo de atención:
            </label>
            <select id="tipo-atencion" className="form-select" value={tipoAtencion} onChange={(event) => setTipoAtencion(event.target.value)}>
              <option value="">Seleccionar tipo de atención</option>
              {tiposAtencion.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
            <button type="button" className="boton-generar" onClick={generarTurno} disabled={generando}>
              {generando ? 'Generando...' : 'GENERAR NÚMERO'}
            </button>
          </div>
          {error && <p className="mensaje-error">{error}</p>}
          {turnoGenerado && (
            <div className="turno-generado">
              <p>Tu turno:</p>
              <p className="numero-turno">{turnoGenerado}</p>
              <p>Estado: En espera</p>
              <Link to="/estado" className="boton-continuar boton-confirmar-turno">→</Link>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default Turno
