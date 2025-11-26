// src/services/segurosService.js
import segurosApi from "../api/segurosApi";

export async function listarSeguros() {
    try {
        console.log("🔄 listarSeguros: Iniciando llamada a la API...");
        const resultado = await segurosApi.getAll();
        console.log("✅ listarSeguros: Datos recibidos:", resultado);
        return resultado;
    } catch (error) {
        console.error('❌ listarSeguros: Error al listar seguros:', error);
        throw error;
    }
}

export async function obtenerSeguros(id) {
    try {
        if (!id) throw new Error('ID de seguro es requerido');
        return await segurosApi.getById(id);
    } catch (error) {
        console.error(`Error al obtener seguro ${id}:`, error);
        throw error;
    }
}

export async function crearSeguros(data) {
    try {
        if (!data || typeof data !== 'object') throw new Error('Datos de seguro inválidos');
        return await segurosApi.create("",data);
    } catch (error) {
        // manejar conflicto (409) o mensaje de conflict
        const status = error?.response?.status;
        const msg = error?.message ?? '';
        if (status === 409 || msg.includes('409') || msg.includes('Conflict')) {
            throw new Error('Ya existe un seguro con los mismos detalles');
        }
        console.error('Error al crear seguro:', error);
        throw error;
    }
}

export async function actualizarSeguros(id, data) {
    try {
        if (!id) throw new Error('ID de seguro es requerido para actualizar');
        if (!data || typeof data !== 'object') throw new Error('Datos de seguro inválidos');
        return await segurosApi.update(id, data);
    } catch (error) {
        console.error(`Error al actualizar seguro ${id}:`, error);
        throw error;
    }
}

export async function eliminarSeguros(id) {
    try {
        if (!id) throw new Error('ID de seguro es requerido para eliminar');
        return await segurosApi.delete(id);
    } catch (error) {
        console.error(`Error al eliminar seguro ${id}:`, error);
        throw error;
    }
}
