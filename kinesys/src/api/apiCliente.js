import { getEndpoint } from '../config/apiConfig';

export function crearApiCliente(ruta) {
    const URL_BASE = getEndpoint(ruta);

    async function respuesta(url = "", opciones = {}) {
        const token = localStorage.getItem('authToken');
        
        const headers = {
            'Content-Type': 'application/json',
            ...opciones.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        console.log("🌐 URL de la solicitud:", `${URL_BASE}${url}`);

        const respuesta = await fetch(`${URL_BASE}${url}`, {
            headers,
            ...opciones,
        });
        
        if (!respuesta.ok) {
            const msg = await respuesta.text();
            throw new Error(`Error en la solicitud: ${respuesta.status} ${msg || "Error en la API"}`);
        }
        
        if (respuesta.status !== 204) {
            return await respuesta.json();
        }
        
        return null;
    }

    return {
        // Get All por defecto
        getAll: () => respuesta(),
        
        // Get All personalizado con endpoint diferente
        getAllCustom: (endpointPersonalizado = "") => respuesta(endpointPersonalizado),
        
        getById: (id) => respuesta(`/${id}`),
        
        // Create con endpoint personalizable
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
        
        // Método genérico para máxima flexibilidad
        customRequest: (url, opciones = {}) => respuesta(url, opciones)
    };
}