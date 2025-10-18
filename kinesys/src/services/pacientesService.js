// src/services/pacientesService.js
import * as pacientesApi from "../api/pacientesApi";

export async function listarPacientes() {
  return await pacientesApi.getAllPacientes();
}

export async function obtenerPacientes(id) {
  return await pacientesApi.getPacientesById(id);
}

export async function crearPacientes(data) {
  return await pacientesApi.createPacientes(data);
}

export async function actualizarPacientes(id, data) {
  return await pacientesApi.updatePacientes(id, data);
}

export async function eliminarPacientes(id) {
  return await pacientesApi.deletePacientes(id);
}
