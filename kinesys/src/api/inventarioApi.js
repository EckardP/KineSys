// src/api/inventarioApi.js

import { getEndpoint } from "../config/apiConfig";

const API_URL = getEndpoint("/Inventario");

// Métodos disponibles para inventario

export async function getAllInventario() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener inventario");
  return await res.json();
}

export async function getInventarioById(id) {
  const res = await fetch(`{API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener inventario por ID");
  return await res.json();
}

export async function createInventario(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear inventario");
  return await res.json();
}

export async function updateInventario(id, data) {
  const res = await fetch(`{API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar inventario");
}

export async function deleteInventario(id) {
  const res = await fetch(`{API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar inventario");
}
