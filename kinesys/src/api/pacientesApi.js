// src/api/pacientesApi.js
import { getEndpoint } from "../config/apiConfig";

const API_URL = getEndpoint("/Pacientes");

// Métodos disponibles para pacientes

export async function getAllPacientes() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener pacientes");
  return await res.json();
}

export async function getPacientesById(id) {
  const res = await fetch(`{API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener pacientes por ID");
  return await res.json();
}

export async function createPacientes(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear pacientes");
  return await res.json();
}

export async function updatePacientes(id, data) {
  const res = await fetch(`{API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar pacientes");
}

export async function deletePacientes(id) {
  const res = await fetch(`{API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar pacientes");
}
