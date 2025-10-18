// src/api/citasApi.js

import { getEndpoint } from "../config/apiConfig";

const API_URL = getEndpoint("/Inventario");

// Métodos disponibles para citas

export async function getAllCitas() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener citas");
  return await res.json();
}

export async function getCitasById(id) {
  const res = await fetch(`{API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener citas por ID");
  return await res.json();
}

export async function createCitas(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear citas");
  return await res.json();
}

export async function updateCitas(id, data) {
  const res = await fetch(`{API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar citas");
}

export async function deleteCitas(id) {
  const res = await fetch(`{API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar citas");
}
