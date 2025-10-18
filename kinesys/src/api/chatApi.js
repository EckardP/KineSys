// src/api/chatApi.js

import { getEndpoint } from "../config/apiConfig";

const API_URL = getEndpoint("/Chat");

// Métodos disponibles para chat

export async function getAllChat() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener chat");
  return await res.json();
}

export async function getChatById(id) {
  const res = await fetch(`{API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener chat por ID");
  return await res.json();
}

export async function createChat(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear chat");
  return await res.json();
}
