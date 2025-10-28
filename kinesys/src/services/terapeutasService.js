// src/services/terapeutasService.js
import {terapeutasApi} from '../api/terapeutasApi';

export async function listarTerapeutas() {
  try {
    return await terapeutasApi.getAll(); // ✅ Usa getAll sin filtro
  } catch (error) {
    console.error('Error al listar terapeutas:', error);
    throw error;
  }
}

export async function obtenerTerapeuta(id) {
  try {
    return await terapeutasApi.getById(id);
  } catch (error) {
    console.error(`Error al obtener terapeuta ${id}:`, error);
    throw error;
  }
}

export async function crearTerapeuta(data) {
  try {
    return await terapeutasApi.create(data);
  } catch (error) {
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('Ya existe un terapeuta con ese documento de identidad');
    }
    console.error('Error al crear terapeuta:', error);
    throw error;
  }
}

export async function actualizarTerapeuta(id, data) {
  try {
    return await terapeutasApi.update(id, data);
  } catch (error) {
    console.error(`Error al actualizar terapeuta ${id}:`, error);
    throw error;
  }
}

export async function eliminarTerapeuta(id) {
  try {
    return await terapeutasApi.delete(id);
  } catch (error) {
    console.error(`Error al eliminar terapeuta ${id}:`, error);
    throw error;
  }
}