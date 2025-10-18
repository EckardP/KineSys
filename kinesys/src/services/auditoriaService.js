// src/services/auditoriaService.js
import * as auditoriaApi from "../api/auditoriaApi";

export async function listarAuditoria() {
  return await auditoriaApi.getAllAuditoria();
}

export async function obtenerAuditoria(id) {
  return await auditoriaApi.getAuditoriaById(id);
}

export async function crearAuditoria(data) {
  return await auditoriaApi.createAuditoria(data);
}

export async function actualizarAuditoria(id, data) {
  return await auditoriaApi.updateAuditoria(id, data);
}

export async function eliminarAuditoria(id) {
  return await auditoriaApi.deleteAuditoria(id);
}
