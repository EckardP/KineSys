// src/services/tratamientosService.js
import { tratamientosApi } from '../api/tratamientosApi';

export const listarTratamientos = async () => {
  try {
    return await tratamientosApi.getAll();
  } catch (error) {
    console.error('Error al listar tratamientos:', error);
    throw error;
  }
};

export const obtenerTratamiento = async (id) => {
  try {
    return await tratamientosApi.getById(id);
  } catch (error) {
    console.error('Error al obtener tratamiento:', error);
    throw error;
  }
};

export const crearTratamiento = async (tratamientoData) => {
  try {
    return await tratamientosApi.create('', tratamientoData);
  } catch (error) {
    console.error('Error al crear tratamiento:', error);
    throw error;
  }
};

export const actualizarTratamiento = async (id, tratamientoData) => {
  try {
    return await tratamientosApi.update(`/${id}`, tratamientoData);
  } catch (error) {
    console.error('Error al actualizar tratamiento:', error);
    throw error;
  }
};

export const eliminarTratamiento = async (id) => {
  try {
    return await tratamientosApi.delete(id);
  } catch (error) {
    console.error('Error al eliminar tratamiento:', error);
    throw error;
  }
};