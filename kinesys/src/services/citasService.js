// src/services/citasService.js
import * as citasApi from "../api/citasApi";

export async function listarCitas() {
  return await citasApi.getAllCitas();
}

export async function obtenerCitas(id) {
  return await citasApi.getCitasById(id);
}

export async function crearCitas(data) {
  return await citasApi.createCitas(data);
}

export async function actualizarCitas(id, data) {
  return await citasApi.updateCitas(id, data);
}

export async function eliminarCitas(id) {
  return await citasApi.deleteCitas(id);
}
