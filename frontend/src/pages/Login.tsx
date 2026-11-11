import { useState } from 'react'

function ServicioUbicacion() {
    const [error, setError] = useState<string | null>(null)

    const handleLocationError = () => {
        setError('No se pudo acceder a la ubicación.')
    }

    return (
        <div className="container py-4">
            <h1 className="h3 mb-3">Seleccionar sucursal</h1>
            {error && <p className="text-danger">{error}</p>}

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="sucursal" className="form-label">Sucursal</label>
                        <select id="sucursal" className="form-select" defaultValue="">
                            <option value="" disabled>Selecciona una sucursal</option>
                            <option value="central">Central</option>
                            <option value="norte">Norte</option>
                            <option value="sur">Sur</option>
                        </select>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={handleLocationError}>
                        Usar mi ubicación
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ServicioUbicacion