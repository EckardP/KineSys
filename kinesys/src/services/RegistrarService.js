// src/services/registroService.js
import { RegistrarApi  } from '../api/RegistrarApi';

/**
 * Registra un nuevo usuario
 * @param {Object} data - Datos del usuario a registrar
 * @returns {Promise<Object>} - Respuesta de la API
 */
export async function registrarUsuario(data) {
  try {
    return await RegistrarApi.create(data);
  } catch (error) {
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('Ya existe un usuario con los mismos datos');
    }
    console.error('Error al registrar usuario:', error);
    throw error;
  }
}