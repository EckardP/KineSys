// src/services/tratamientosService.js
import * as tratamientosApi from "../api/tratamientosApi";

export async function listarTratamientos() {
  return await tratamientosApi.getAllTratamientos();
}

export async function obtenerTratamientos(id) {
  return await tratamientosApi.getTratamientosById(id);
}

export async function crearTratamientos(data) {
  return await tratamientosApi.createTratamientos(data);
}

export async function actualizarTratamientos(id, data) {
  return await tratamientosApi.updateTratamientos(id, data);
}

export async function eliminarTratamientos(id) {
  return await tratamientosApi.deleteTratamientos(id);
}
