import pacientesApi from "../api/pacientesApi";

export async function listarPacientes() {
  try {
    return await pacientesApi.getAll();
  } catch (error) {
    console.error('Error al listar pacientes:', error);
    throw error;
  }
}

export async function obtenerPaciente(id) {
  try {
    return await pacientesApi.getById(id);
  } catch (error) {
    console.error(`Error al obtener paciente ${id}:`, error);
    throw error;
  }
}

export async function crearPaciente(data) {
  try {
    return await pacientesApi.create(data);
  } catch (error) {
    // Manejo específico para el error de documento duplicado
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('Ya existe un paciente con ese documento de identidad');
    }
    console.error('Error al crear paciente:', error);
    throw error;
  }
}

export async function actualizarPaciente(id, data) {
  try {
    return await pacientesApi.update(id, data);
  } catch (error) {
    console.error(`Error al actualizar paciente ${id}:`, error);
    throw error;
  }
}

export async function eliminarPaciente(id) {
  try {
    return await pacientesApi.delete(id);
  } catch (error) {
    console.error(`Error al eliminar paciente ${id}:`, error);
    throw error;
  }
}


