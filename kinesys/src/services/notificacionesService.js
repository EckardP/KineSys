// src/services/notificacionesService.js
import * as notificacionesApi from "../api/notificacionesApi";

export async function listarNotificaciones() {
  return await notificacionesApi.getAllNotificaciones();
}

export async function obtenerNotificaciones(id) {
  return await notificacionesApi.getNotificacionesById(id);
}

export async function crearNotificaciones(data) {
  return await notificacionesApi.createNotificaciones(data);
}

export async function actualizarNotificaciones(id, data) {
  return await notificacionesApi.updateNotificaciones(id, data);
}

export async function eliminarNotificaciones(id) {
  return await notificacionesApi.deleteNotificaciones(id);
}
