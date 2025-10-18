// src/services/chatService.js
import * as chatApi from "../api/chatApi";

export async function listarChat() {
  return await chatApi.getAllChat();
}

export async function obtenerChat(id) {
  return await chatApi.getChatById(id);
}

export async function crearChat(data) {
  return await chatApi.createChat(data);
}

export async function actualizarChat(id, data) {
  return await chatApi.updateChat(id, data);
}

export async function eliminarChat(id) {
  return await chatApi.deleteChat(id);
}
