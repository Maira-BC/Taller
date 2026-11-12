import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { calcularDistancia, sucursalMasCercana, obtenerSucursales } from '../Services/Sucursales'
import { useEffect, useState } from 'react';
import useGeolocation from '../Services/APIgeolocalizacion';
import { obtenerComuna, type Comuna } from '../Services/APIopenmap';
import type { Sucursal } from '../Services/Sucursales';


type SucursalesProps = {
  setSucursal: (sucursal: string) => void
}

function Sucursales({ setSucursal }: SucursalesProps) {
    const { location, error } = useGeolocation();
    const [comuna, setComuna] = useState<Comuna | null>(null);
    const [errorComuna, setErrorComuna] = useState<string | null>(null);
    const [seleccionManual, setSeleccionManual] = useState<number | null>(null);
    const [listaSucursales, setListaSucursales] = useState<Sucursal[]>([])
    const [cargando, setCargando] = useState(true)
    const [errorSucursales, setErrorSucursales] = useState('')

    useEffect(() => {
      async function cargarSucursales() {
        try {
          const datos = await obtenerSucursales();
          setListaSucursales(datos);
        }
        catch {
          setErrorSucursales('No se pudieron cargar las sucursales.')
        }
        finally {
          setCargando(false)
        }
      }
      cargarSucursales()
    }, [])

    useEffect(() => {
        const { latitude, longitude } = location;
        if (latitude === null || longitude === null) return;

        const controller = new AbortController();
        obtenerComuna(latitude, longitude, controller.signal)
            .then(setComuna)
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    setErrorComuna('No se pudo obtener la comuna.');
                }
            });

        return () => controller.abort();
    }, [location]);

    const { latitude, longitude } = location;
    const tieneUbicacion = latitude !== null && longitude !== null;
    const cercana = tieneUbicacion ? sucursalMasCercana(latitude, longitude, listaSucursales)?.sucursal : null;
    const idSeleccionado = seleccionManual ?? cercana?.id ?? null;
    const sucursalSeleccionada = listaSucursales.find((s) => s.id === idSeleccionado);

    const distanciaA = (id: number) => {
        if (!tieneUbicacion) return null;
        const sucursal = listaSucursales.find((s) => s.id === id)!;
        return calcularDistancia(latitude, longitude, sucursal.latitude, sucursal.longitude);
    }

    let textoSelector = 'Seleccionar sucursal';
       if (sucursalSeleccionada) textoSelector = sucursalSeleccionada.nombre;
       else if (cargando) textoSelector = 'Cargando sucursales...';
       else if (!error && !errorSucursales) textoSelector = 'Buscando sucursal más cercana...';

    const navigate = useNavigate()

    const confirmarSucursal = () => {
        if (!sucursalSeleccionada) return;
        setSucursal(sucursalSeleccionada.nombre)
        navigate('/ingreso')
    }

  return (
    <>
      <Header sucursal={sucursalSeleccionada?.nombre} />
      <main className="sucursales">
        <div className="contenido-sucursales">
          <h2>SELECCIONAR SUCURSAL</h2>
          <hr />
          {cargando && <p>Cargando sucursales...</p>}
          {errorSucursales && <p className="mensaje-error">{errorSucursales}</p>}
          {!cargando && !errorSucursales && listaSucursales.length === 0 && (<p>No hay sucursales disponibles.</p>)}
          <div className="seleccion-sucursal">
            <label id="label-sucursal">Sucursal:</label>
            <div className="dropdown">
              <button
                type="button" className="dropdown-toggle selector-sucursal" data-bs-toggle="dropdown" aria-expanded="false" aria-labelledby="label-sucursal">
                {textoSelector}
              </button>
              <ul className="dropdown-menu menu-sucursales">
                {listaSucursales.map((sucursal) => {
                  const distancia = distanciaA(sucursal.id);
                  return (
                    <li key={sucursal.id}>
                      <button
                        type="button"
                        className={`dropdown-item ${sucursal.id === idSeleccionado ? 'active' : ''}`}
                        onClick={() => setSeleccionManual(sucursal.id)}
                      >
                        <span>{sucursal.nombre}</span>
                        {distancia !== null && <span className="distancia-sucursal">{distancia.toFixed(1)} km</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            {cercana && sucursalSeleccionada?.id === cercana.id && (
              <p className="info-sucursal">Sucursal más cercana a tu ubicación</p>
            )}
            {comuna && <p className="info-sucursal">Ubicación actual: {comuna.comuna}, {comuna.region}</p>}
            {error && <p className="mensaje-error">{error}</p>}
            {errorComuna && <p className="mensaje-error">{errorComuna}</p>}
            <button type="button" className="boton-continuar boton-confirmar-sucursal" onClick={confirmarSucursal} disabled={!sucursalSeleccionada}>
              →
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

export default Sucursales
