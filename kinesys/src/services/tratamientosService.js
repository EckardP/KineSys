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
    
    // Manejo específico de errores
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('Ya existe un tratamiento con ese nombre');
    }
    
    throw error;
  }
};

export const actualizarTratamiento = async (id, tratamientoData) => {
  try {
    console.log('🔧 Actualizando tratamiento:', {
      id,
      datos: tratamientoData,
      datosCompletos: JSON.stringify(tratamientoData, null, 2)
    });
    
    const resultado = await tratamientosApi.update(id, tratamientoData);
    console.log('✅ Tratamiento actualizado exitosamente:', resultado);
    return resultado;
    
  } catch (error) {
    console.error('❌ Error completo al actualizar tratamiento:', {
      mensaje: error.message,
      stack: error.stack,
      datosEnviados: tratamientoData
    });
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

// Funciones para manejar equipos del tratamiento
export const agregarEquipoATratamiento = async (idTratamiento, equipoData) => {
  try {
    return await tratamientosApi.create(`/${idTratamiento}/equipos`, equipoData);
  } catch (error) {
    console.error('Error al agregar equipo al tratamiento:', error);
    throw error;
  }
};

export const removerEquipoDeTratamiento = async (idTratamiento, idEquipo) => {
  try {
    return await tratamientosApi.delete(`/${idTratamiento}/equipos/${idEquipo}`);
  } catch (error) {
    console.error('Error al remover equipo del tratamiento:', error);
    throw error;
  }
};