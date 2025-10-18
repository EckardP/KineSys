// src/services/facturacionService.js
import * as facturacionApi from "../api/facturacionApi";

export async function listarFacturacion() {
  return await facturacionApi.getAllFacturacion();
}

export async function obtenerFacturacion(id) {
  return await facturacionApi.getFacturacionById(id);
}

export async function crearFacturacion(data) {
  return await facturacionApi.createFacturacion(data);
}

export async function actualizarFacturacion(id, data) {
  return await facturacionApi.updateFacturacion(id, data);
}

export async function eliminarFacturacion(id) {
  return await facturacionApi.deleteFacturacion(id);
}
