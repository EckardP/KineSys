// src/api/notificacionesApi.js
import { getEndpoint } from "../config/apiConfig";

const API_URL = getEndpoint("/Notificaciones");

// Métodos disponibles para notificaciones

export async function getAllNotificaciones() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener notificaciones");
  return await res.json();
}

export async function getNotificacionesById(id) {
  const res = await fetch(`{API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener notificaciones por ID");
  return await res.json();
}

export async function createNotificaciones(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear notificaciones");
  return await res.json();
}
