// src/api/reportesApi.js
import { getEndpoint } from "../config/apiConfig";

const API_URL = getEndpoint("/Reportes");

// Métodos disponibles para reportes

export async function getAllReportes() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener reportes");
  return await res.json();
}

export async function getReportesById(id) {
  const res = await fetch(`{API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener reportes por ID");
  return await res.json();
}

export async function createReportes(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear reportes");
  return await res.json();
}
