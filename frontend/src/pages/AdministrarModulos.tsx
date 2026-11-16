import Header from '../components/Header'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { obtenerModulos, actualizarModulo, crearModulo, eliminarModulo, type ModuloAPI } from '../Services/Modulos'

type AdministrarModulosProps = {
    sucursal: string
    sucursalId: number | null
}

function AdministrarModulos({ sucursal, sucursalId }: AdministrarModulosProps) {
    const [modulos, setModulos] = useState<ModuloAPI[]>([])
    const [nuevoNumero, setNuevoNumero] = useState('')
    const [moduloEditando, setModuloEditando] = useState<number | null>(null)
    const [numeroEditado, setNumeroEditado] = useState('')
    const [moduloPorEliminar, setModuloPorEliminar] = useState<number | null>(null)

    useEffect(() => {
        if (sucursalId === null)
            return

            async function cargarModulos() {
                const datos = await obtenerModulos(sucursalId!)
                setModulos(datos)
            }

        cargarModulos()
    }, [sucursalId])

    async function cambiarEstado(modulo: ModuloAPI) {
        try {
            const actualizado = await actualizarModulo(modulo.id, { activo: !modulo.activo })

            setModulos(anteriores => anteriores.map(m => m.id === actualizado.id ? actualizado : m))
        }

        catch {
            alert('No se pudo cambiar el estado del módulo')
        }
    }

    async function agregarModulo() {
        if (!nuevoNumero || sucursalId === null)
            return

        try {
            const nuevo = await crearModulo(Number(nuevoNumero), sucursalId)

            setModulos(anteriores => [...anteriores, nuevo])
            setNuevoNumero('')
        }

        catch {
            alert('No se pudo crear el módulo')
        }
    }

    async function editarModulo(modulo: ModuloAPI) {
        const numero = Number(numeroEditado)

        if (!Number.isInteger(numero) || numero < 1) {
            alert('Ingrese un número válido')
            return
        }

        try {
            const actualizado = await actualizarModulo(modulo.id, { numero })
            setModulos(anteriores => anteriores.map(m => m.id === actualizado.id ? actualizado : m))

            setModuloEditando(null)
            setNumeroEditado('')
        }

        catch {
            alert('No se pudo editar el módulo')
        }
    }

    async function borrarModulo(modulo: ModuloAPI) {
        try {
            await eliminarModulo(modulo.id)
            setModulos(anteriores => anteriores.filter(m => m.id !== modulo.id))
        }

        catch {
            alert('No se pudo eliminar el módulo')
        }
    }

    return (
        <>
            <Header sucursal={sucursal} />
            <main className="administracion-modulos">
                <div className="contenido-administracion">
                    <h2>ADMINISTRACIÓN DE MÓDULOS</h2>
                    <hr />
                    <div className="formulario-modulo-admin">
                        <h3>Agregar módulo</h3>
                        <div className="campos-modulo-admin">
                            <input
                                type="number"
                                min="1"
                                placeholder="Número del módulo"
                                value={nuevoNumero}
                                onChange={e => setNuevoNumero(e.target.value)}
                            />
                            <button onClick={agregarModulo}>Agregar</button>
                        </div>
                    </div>
                    <div className="lista-modulos-admin">
                        {modulos.map((modulo) => (
                            <div className="tarjeta-modulo-admin" key={modulo.id}>
                                <h3>Módulo {modulo.numero}</h3>
                                <p>{modulo.activo ? 'Activo' : 'Inactivo'}</p>
                                <button className="boton-estado-admin" onClick={() => cambiarEstado(modulo)}>
                                    {modulo.activo ? 'Desactivar' : 'Activar'}
                                </button>
                                {moduloEditando === modulo.id ? (
                                    <div>
                                        <input className="input-editar-admin"
                                            type="number"
                                            min="1"
                                            value={numeroEditado}
                                            onChange={e => setNumeroEditado(e.target.value)}
                                        />
                                        <button className="boton-guardar-admin" onClick={() => editarModulo(modulo)}>Guardar</button>
                                        <button className="boton-cancelar-admin" onClick={() => setModuloEditando(null)}>Cancelar</button>
                                    </div>
                                ) : (
                                    <button className="boton-editar-admin" onClick={() => {
                                        setModuloEditando(modulo.id)
                                        setNumeroEditado(String(modulo.numero))
                                    }}>Editar</button>
                                )}
                                {moduloPorEliminar === modulo.id ? (
                                    <div>
                                        <p>¿Está seguro que desea eliminar este módulo?</p>
                                        <button className="boton-confirmar-admin" onClick={() => {borrarModulo(modulo); setModuloPorEliminar(null)}}>Confirmar</button>
                                        <button className="boton-cancelar-admin" onClick={() => setModuloPorEliminar(null)}>Cancelar</button>
                                    </div>
                                ) : (
                                    <button className="boton-eliminar-admin" onClick={() => setModuloPorEliminar(modulo.id)}>Eliminar</button>
                                )}
                            </div>
                        ))}
                    </div>
                    <Link to="/estado" className="boton-continuar boton-volver-historial" aria-label="Volver al estado de atención">←</Link>
                </div>
            </main>
        </>
    )
}

export default AdministrarModulos