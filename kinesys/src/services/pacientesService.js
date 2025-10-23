import pacientesApi from "../api/pacientesApi"; // ✅ Importa el cliente por defecto

export async function listarPacientes() {
  return await pacientesApi.getAll();
}

export async function obtenerPacientes(id) {
  return await pacientesApi.getById(id);
}

export async function crearPacientes(data) {
  return await pacientesApi.create(data);
}

export async function actualizarPacientes(id, data) {
  return await pacientesApi.update(id, data);
}

export async function eliminarPacientes(id) {
  return await pacientesApi.delete(id);
}
