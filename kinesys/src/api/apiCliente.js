import { getEndpoint } from '../config/apiConfig';

export function crearApiCliente(ruta){
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

    // CORRECCIÓN en apiCliente.js - Opción 2 (Flexible)
return {
    getAll: () => respuesta(),
    getById: (id) => respuesta(`/${id}`),
    create: (url = "", data) => respuesta(url, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    // ✅ SOLUCIÓN FLEXIBLE: Manejar tanto números como strings
    update: (param, data) => {
        const url = String(param).startsWith('/') ? String(param) : `/${param}`;
        return respuesta(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    delete: (id) => respuesta(`/${id}`, {
        method: 'DELETE'
    }),
};
}