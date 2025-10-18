import { getEndpoint } from "../config/apiConfig";

const API_URL = getEndpoint("/Terapeutas");

// GET: todos
export async function getAllTerapeutas() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener terapeutas");
  return await res.json();
}

// GET: por ID
export async function getTerapeutaById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener terapeuta por ID");
  return await res.json();
}

// POST: crear
export async function createTerapeuta(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear terapeuta");
  return await res.json();
}

// PUT: actualizar
export async function updateTerapeuta(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar terapeuta");
}

// DELETE: eliminar
export async function deleteTerapeuta(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar terapeuta");
}
