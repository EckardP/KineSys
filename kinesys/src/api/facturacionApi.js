// src/api/facturacionApi.js

import { getEndpoint } from "../config/apiConfig";

const API_URL = getEndpoint("/Facturacion");

// Métodos disponibles para facturacion

export async function getAllFacturacion() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener facturacion");
  return await res.json();
}

export async function getFacturacionById(id) {
  const res = await fetch(`{API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener facturacion por ID");
  return await res.json();
}

export async function createFacturacion(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear facturacion");
  return await res.json();
}

export async function updateFacturacion(id, data) {
  const res = await fetch(`{API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar facturacion");
}

export async function deleteFacturacion(id) {
  const res = await fetch(`{API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar facturacion");
}
