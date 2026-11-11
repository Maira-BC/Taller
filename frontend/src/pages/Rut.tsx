import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

type RutProps = {
  sucursal: string
}

function Rut({ sucursal }: RutProps) {
    const [rut, setRut] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const agregarCaracter = (valor: string) => {
        if (rut.length < 9) {
            setRut(rut + valor)
        }
    }
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (rut.length < 8) {
            setError('Ingrese un RUT válido')
            return
        }
        setError('')
        navigate('/turno')
    }
    const eliminarCaracter = () => {
        setRut(rut.slice(0, -1))
    }
  return (
    <>
      <Header sucursal={sucursal} />
      <main className="container rut">
        <div className="row justify-content-center">
            <div className="col-11 col-md-6 col-lg-4">
                <form className="formulario-rut" onSubmit={handleSubmit}>
                    <label htmlFor="rut" className="form-label">Ingrese su RUT</label>
                    <input type="text" id="rut" className="form-control" value={rut} readOnly placeholder="12.345.678-9" />
                    {error && <p className="mensaje-error">{error}</p>}
                    <div className="teclado-rut">
                        <button type="button" className="tecla-rut" onClick={() => agregarCaracter('1')}>1</button>
                        <button type="button" className="tecla-rut" onClick={() => agregarCaracter('2')}>2</button>
                        <button type="button" className="tecla-rut" onClick={() => agregarCaracter('3')}>3</button>
                        <button type="button" className="tecla-rut" onClick={() => agregarCaracter('4')}>4</button>
                        <button type="button" className="tecla-rut" onClick={() => agregarCaracter('5')}>5</button>
                        <button type="button" className="tecla-rut" onClick={() => agregarCaracter('6')}>6</button>
                        <button type="button" className="tecla-rut" onClick={() => agregarCaracter('7')}>7</button>
                        <button type="button" className="tecla-rut" onClick={() => agregarCaracter('8')}>8</button>
                        <button type="button" className="tecla-rut" onClick={() => agregarCaracter('9')}>9</button>
                        <button type="button" className="tecla-rut" onClick={() => agregarCaracter('0')}>0</button>
                        <button type="button" className="tecla-rut" onClick={() => agregarCaracter('K')}>K</button>
                        <button type="button" className="tecla-rut" onClick={eliminarCaracter}>⌫</button>
                    </div>
                    <button type="submit" className="boton-continuar boton-confirmar-rut">→</button>
                </form>
            </div>
        </div>
      </main>
    </>
  )
}

export default Rut