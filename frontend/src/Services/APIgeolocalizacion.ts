// Cuando el usuario ingrese a la pagina, se pide permiso para obtener la ubicacion del usuario.
// Si el usuario acepta se obtiene la ubicacion y se guarda en un estado,
// si el usuario no acepta se guarda un error en un estado.

import { useEffect, useState } from 'react';

interface Ubicacion {
    latitude: number | null;
    longitude: number | null;
}

function useGeolocation() {
    const [location, setLocation] = useState<Ubicacion>({ latitude: null, longitude: null });
    const [error, setError] = useState<string | null>(() =>
        navigator.geolocation ? null : 'La geolocalización no es compatible con este navegador.'
    );

    useEffect(() => {
        if (!navigator.geolocation) return;

        const handleSuccess = (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            console.log('Ubicacion obtenida:', latitude, longitude);
        };

        const handleError = (error: GeolocationPositionError) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    setError('Se rechazó la solicitud de geolocalización del usuario.');
                    break;
                case error.POSITION_UNAVAILABLE:
                    setError('La información de ubicación no está disponible.');
                    break;
                case error.TIMEOUT:
                    setError('La solicitud para obtener la ubicación del usuario ha expirado.');
                    break;
                default:
                    setError('Ocurrió un error desconocido.');
                    break;
            }
        };

        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0 // toma ubicacion mas reciente
        });
    }, []);

    return { location, error };
}

export default useGeolocation;