// src/api/tratamientosApi.js
import { getEndpoint } from "../config/apiConfig";

const API_URL = getEndpoint("/Tratamientos");


// Métodos disponibles para tratamientos

export async function getAllTratamientos() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener tratamientos");
  return await res.json();
}

export async function getTratamientosById(id) {
  const res = await fetch(`{API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener tratamientos por ID");
  return await res.json();
}

export async function createTratamientos(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear tratamientos");
  return await res.json();
}

export async function updateTratamientos(id, data) {
  const res = await fetch(`{API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar tratamientos");
}

export async function deleteTratamientos(id) {
  const res = await fetch(`{API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar tratamientos");
}
