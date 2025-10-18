// src/services/terapeutasService.js
import * as terapeutasApi from "../api/terapeutasApi";

export async function listarTerapeutas() {
  return await terapeutasApi.getAllTerapeutas();
}

export async function obtenerTerapeutas(id) {
  return await terapeutasApi.getTerapeutasById(id);
}

export async function crearTerapeutas(data) {
  return await terapeutasApi.createTerapeutas(data);
}

export async function actualizarTerapeutas(id, data) {
  return await terapeutasApi.updateTerapeutas(id, data);
}

export async function eliminarTerapeutas(id) {
  return await terapeutasApi.deleteTerapeutas(id);
}
