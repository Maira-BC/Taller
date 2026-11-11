import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { tiposAtencion, type Turno as TurnoData } from '../data/turnos'

type TurnoProps = {
  sucursal: string
  cantidadTurnos: number
  agregarTurno: (nuevoTurno: TurnoData) => void
}

function Turno({ sucursal, cantidadTurnos, agregarTurno }: TurnoProps) {
  const [tipoAtencion, setTipoAtencion] = useState('')
  const [turnoGenerado, setTurnoGenerado] = useState('')
  const [error, setError] = useState('')

  const generarTurno = () => {
    if (tipoAtencion === '') {
      setError('Seleccione un tipo de atención')
      return
    }
    const numero = cantidadTurnos + 1
    let numeroFormateado
    if (numero < 10) {
      numeroFormateado = '00' + numero
    }
    else if (numero < 100) {
      numeroFormateado = '0' + numero
    }
    else {
      numeroFormateado = numero
    }

    const nuevoNumero = 'A-' + numeroFormateado
    const nuevoTurno: TurnoData = {
      numero: nuevoNumero,
      tipo: tipoAtencion,
      estado: 'En espera',
      sucursal: sucursal,
      modulo: null
    }
    agregarTurno(nuevoTurno)
    setTurnoGenerado(nuevoNumero)
    setError('')
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
            <button type="button" className="boton-generar" onClick={generarTurno}>
              GENERAR NÚMERO
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