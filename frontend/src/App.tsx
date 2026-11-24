import { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Inicio from "./pages/Inicio"
import Sucursales from "./pages/Sucursales"
import Ingreso from "./pages/Ingreso"
import Turno from "./pages/Turno"
import Rut from "./pages/Rut"
import type { Turno as TurnoData } from "./data/turnos"
import Estado from "./pages/Estado"
import Historial from "./pages/Historial"
import Metricas from "./pages/Metricas"
import Login from "./pages/Login"
import Registro from "./pages/Registro"
import Atencion from "./pages/Atencion"
import AdministrarModulos from "./pages/AdministrarModulos"
import type { UsuarioAPI } from "./Services/Usuarios"
import { SesionContext } from "./context/SesionContext"
import { Navigate } from 'react-router-dom'

// La sucursal se guarda en el navegador para pedirla una sola vez, aunque se recargue la página
const CLAVE_SUCURSAL = 'sucursal'
const CLAVE_FUNCIONARIO = 'funcionario'

function leerFuncionarioGuardado(): UsuarioAPI | null {
  try {
    const guardado = sessionStorage.getItem(CLAVE_FUNCIONARIO)
    return guardado ? JSON.parse(guardado) as UsuarioAPI : null
  }
  catch {
    return null
  }
}

function leerSucursalGuardada(): { id: number, nombre: string } | null {
  try {
    const guardada = localStorage.getItem(CLAVE_SUCURSAL)
    return guardada ? JSON.parse(guardada) : null
  }
  catch {
    return null
  }
}

function App() {
  const [sucursal, setSucursal] = useState(() => leerSucursalGuardada()?.nombre ?? '')
  const [sucursalId, setSucursalId] = useState<number | null>(() => leerSucursalGuardada()?.id ?? null)
  const [funcionario, setFuncionario] = useState<UsuarioAPI | null>(
    () => leerFuncionarioGuardado()
  )

  useEffect(() => {
    try {
      if (funcionario) {
        sessionStorage.setItem(CLAVE_FUNCIONARIO, JSON.stringify(funcionario))
      }
      else {
        sessionStorage.removeItem(CLAVE_FUNCIONARIO)
      }
    }
    catch {
      console.log('No se pudo guardar la sesión del funcionario.')
    }
  }, [funcionario])

  useEffect(() => {
    if (sucursalId === null) return
    try {
      localStorage.setItem(CLAVE_SUCURSAL, JSON.stringify({ id: sucursalId, nombre: sucursal }))
    }
    catch {
      // Sin almacenamiento disponible la sucursal solo dura hasta recargar
    }
  }, [sucursal, sucursalId])
  const [turnos, setTurnos] = useState<TurnoData[]>([])
  const agregarTurno = (nuevoTurno: TurnoData) => {
    setTurnos([...turnos, nuevoTurno])
  }
  const cerrarSesion = () => setFuncionario(null)
  return (
    <SesionContext.Provider value={{ funcionario, cerrarSesion }}>
      <Routes>
        <Route path="/" element={<Inicio sucursal={sucursal} sucursalId={sucursalId} />} />
        <Route path="/sucursales" element={<Sucursales setSucursal={setSucursal} setSucursalId={setSucursalId} esFuncionario={funcionario !== null} />} />
        <Route path="/ingreso" element={<Ingreso sucursal={sucursal} />} />
        <Route path="/turno" element={<Turno sucursal={sucursal} sucursalId={sucursalId} agregarTurno={agregarTurno} />} />
        <Route path="/rut" element={<Rut sucursal={sucursal} />} />
        <Route path="/estado" element={ funcionario?.token ? <Estado sucursal={sucursal} sucursalId={sucursalId} /> : <Navigate to="/login" replace /> } />
        <Route path="/administrar-modulos" element={ funcionario?.token ? <AdministrarModulos sucursal={sucursal} sucursalId={sucursalId} /> : <Navigate to="/login" replace /> } />
        <Route path="/historial" element={ funcionario?.token ? <Historial sucursal={sucursal} sucursalId={sucursalId} /> : <Navigate to="/login" replace /> } />
        <Route path="/metricas" element={ funcionario?.token ? <Metricas sucursal={sucursal} sucursalId={sucursalId} /> : <Navigate to="/login" replace /> } />
        <Route path="/login" element={<Login sucursal={sucursal} sucursalId={sucursalId} setFuncionario={setFuncionario} />} />
        <Route path="/registro" element={ funcionario?.token ? <Registro sucursal={sucursal} /> : <Navigate to="/login" replace /> } />
        <Route path="/atencion" element={  <Atencion sucursal={sucursal} sucursalId={sucursalId} /> } />
      </Routes>
    </SesionContext.Provider>
  )
}

export default App