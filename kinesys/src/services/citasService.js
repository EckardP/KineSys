// src/services/citasService.js
import {citasApi} from '../api/citasApi';

export async function listarCitas() {
  try {
    return await citasApi.getAll(); // ✅ Usa getAll sin filtro
  } catch (error) {
    console.error('Error al listar citas:', error);
    throw error;
  }
}

export async function obtenerCita(id) {
  try {
    return await citasApi.getById(id);
  } catch (error) {
    console.error(`Error al obtener cita ${id}:`, error);
    throw error;
  }
}

export async function crearCita(data) {
  try {
    return await citasApi.create(data);
  } catch (error) {
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('Ya existe una cita con los mismos detalles');
    }
    console.error('Error al crear cita:', error);
    throw error;
  }
}

export async function actualizarCita(id, data) {
  try {
    return await citasApi.update(id, data);
  } catch (error) {
    console.error(`Error al actualizar cita ${id}:`, error);
    throw error;
  }
}

export async function eliminarCita(id) {
  try {
    return await citasApi.delete(id);
  } catch (error) {
    console.error(`Error al eliminar cita ${id}:`, error);
    throw error;
  }
}