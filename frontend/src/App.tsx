import { useState, useEffect } from "react"
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
import AdministrarModulos from "./pages/AdministrarModulos"

function App() {
  const [sucursal, setSucursal] = useState(
    () => sessionStorage.getItem('sucursal') || ''
  )
  const [sucursalId, setSucursalId] = useState<number | null>(
    () => {
      const id = sessionStorage.getItem('sucursalId')
      return id ? Number(id) : null
    }
  )
  const [turnos, setTurnos] = useState<TurnoData[]>([])
  const agregarTurno = (nuevoTurno: TurnoData) => {
    setTurnos([...turnos, nuevoTurno])
  }

  useEffect(() => {
    if (sucursalId !== null) {
      sessionStorage.setItem('sucursal', sucursal)
      sessionStorage.setItem('sucursalId', String(sucursalId))
    }
  }, [sucursal, sucursalId])

  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/sucursales" element={<Sucursales setSucursal={setSucursal} setSucursalId={setSucursalId} />} />
      <Route path="/ingreso" element={<Ingreso sucursal={sucursal} />} />
      <Route path="/turno" element={<Turno sucursal={sucursal} sucursalId={sucursalId} agregarTurno={agregarTurno} />} />
      <Route path="/rut" element={<Rut sucursal={sucursal} />} />
      <Route path="/estado" element={<Estado sucursal={sucursal} sucursalId={sucursalId} />} />
      <Route path="/administrar-modulos" element={<AdministrarModulos sucursal={sucursal} sucursalId={sucursalId} />} />
      <Route path="/historial" element={<Historial sucursal={sucursal} turnos={turnos} />} />
    </Routes>
  )
}

export default App