// src/services/inventarioService.js
import * as inventarioApi from "../api/inventarioApi";

export async function listarInventario() {
  return await inventarioApi.getAllInventario();
}

export async function obtenerInventario(id) {
  return await inventarioApi.getInventarioById(id);
}

export async function crearInventario(data) {
  return await inventarioApi.createInventario(data);
}

export async function actualizarInventario(id, data) {
  return await inventarioApi.updateInventario(id, data);
}

export async function eliminarInventario(id) {
  return await inventarioApi.deleteInventario(id);
}
