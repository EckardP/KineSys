import { getEndpoint } from '../config/apiConfig';

// Variable global para almacenar el token actual
let tokenGlobal = null;

// Función para actualizar el token desde los componentes
export function setAuthToken(token) {
  tokenGlobal = token;
}

export function crearApiCliente(ruta) {
    const URL_BASE = getEndpoint(ruta);

    async function respuesta(url = "", opciones = {}) {
        const token = tokenGlobal || sessionStorage.getItem('authToken');

        const headers = {
            'Content-Type': 'application/json',
            ...opciones.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const respuesta = await fetch(`${URL_BASE}${url}`, {
                headers,
                credentials: 'include',
                ...opciones,
            });
            
            if (!respuesta.ok) {
                // Si es error 401, limpiar token
                if (respuesta.status === 401) {
                    tokenGlobal = null;
                    sessionStorage.removeItem('authToken');
                    sessionStorage.removeItem('usuario');
                    window.dispatchEvent(new Event('auth-token-expired'));
                }
                
                const msg = await respuesta.text();
                throw new Error(`Error en la solicitud: ${respuesta.status} ${msg || "Error en la API"}`);
            }
            
            if (respuesta.status !== 204) {
                return await respuesta.json();
            }
            
            return null;
        } catch (error) {
            console.error("❌ Error en fetch:", error);
            throw error;
        }
    }

    return {
        getAll: () => respuesta(),
        getAllCustom: (endpointPersonalizado = "") => respuesta(endpointPersonalizado),
        getById: (id) => respuesta(`/${id}`),
        create: (endpointPersonalizado = "", data) => respuesta(endpointPersonalizado, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (url, data) => respuesta(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => respuesta(`/${id}`, {
            method: 'DELETE'
        }),
        customRequest: (url, opciones = {}) => respuesta(url, opciones)
    };
}

