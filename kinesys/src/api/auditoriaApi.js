// src/api/auditoriaApi.js

import { getEndpoint } from "../config/apiConfig";

const API_URL = getEndpoint("/Auditoria");

// Métodos disponibles para auditoria

export async function getAllAuditoria() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener auditoria");
  return await res.json();
}

export async function getAuditoriaById(id) {
  const res = await fetch(`{API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener auditoria por ID");
  return await res.json();
}
