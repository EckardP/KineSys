import { getEndpoint } from '../config/apiConfig';

export function crearApiCliente(ruta){
    const URL_BASE = getEndpoint(ruta);

    async function respuesta(url = "", opciones = {}) {
        const respuesta = await fetch(`${URL_BASE}${url}`, {
            headers: {
                'Content-Type': 'application/json', ...opciones.headers
            },
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
        getAll: () => respuesta(),
        getById: (id) => respuesta(`/${id}`),
        create: (data) => respuesta("", {
            method: 'POST',
            body: JSON.stringify(data)}),
        update: (id, data) => respuesta(`/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)}),
        delete: (id) => respuesta(`/${id}`, {
            method: 'DELETE'}),
    };
}