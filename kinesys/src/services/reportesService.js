// src/services/reportesService.js
import * as reportesApi from "../api/reportesApi";

export async function listarReportes() {
  return await reportesApi.getAllReportes();
}

export async function obtenerReportes(id) {
  return await reportesApi.getReportesById(id);
}

export async function crearReportes(data) {
  return await reportesApi.createReportes(data);
}

export async function actualizarReportes(id, data) {
  return await reportesApi.updateReportes(id, data);
}

export async function eliminarReportes(id) {
  return await reportesApi.deleteReportes(id);
}
