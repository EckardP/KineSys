// src/services/protocolosTratamientoService.js
import { protocoloaTratamientoApi } from '../api/protocolosTratamientoApi';

export const listarProtocolos = async () => {
  try {
    return await protocoloaTratamientoApi.getAll();
  } catch (error) {
    console.error('Error al listar protocolos:', error);
    throw error;
  }
};

export const obtenerProtocolo = async (id) => {
  try {
    return await protocoloaTratamientoApi.getById(id);
  } catch (error) {
    console.error('Error al obtener protocolo:', error);
    throw error;
  }
};

export const crearProtocolo = async (protocoloData) => {
  try {
    return await protocoloaTratamientoApi.create('', protocoloData);
  } catch (error) {
    console.error('Error al crear protocolo:', error);
    throw error;
  }
};

export const actualizarProtocolo = async (id, protocoloData) => {
  try {
    return await protocoloaTratamientoApi.update(`/${id}`, protocoloData);
  } catch (error) {
    console.error('Error al actualizar protocolo:', error);
    throw error;
  }
};