import pacientesApi from "../api/pacientesApi";

export async function listarPacientes() {
  try {
    const todasLasPersonas = await pacientesApi.getAll()
    return todasLasPersonas.filter(persona => persona.rol === 1)
  } catch (error) {
    console.error('Error al listar pacientes:', error)
    throw error
  }
}

export async function obtenerPaciente(id) {
  try {
    const persona = await pacientesApi.getById(id)
    if (persona.rol !== 1) {
      throw new Error('La persona encontrada no es un paciente')
    }
    return persona
  } catch (error) {
    console.error(`Error al obtener paciente ${id}:`, error)
    throw error
  }
}

export async function crearPaciente(data) {
  try {
    const datosCompletos = {
      ...data,
      user: data.documentoIdentidad,
      password: data.documentoIdentidad,
      activo: true,
      fechaRegistro: new Date().toISOString()
    };

    const resultado = await pacientesApi.create("/Register", datosCompletos);
    return resultado;
  } catch (error) {
    console.error('Error al crear paciente:', error);
    if (error.message.includes('409') || error.response?.status === 409) {
      throw new Error('Ya existe un paciente con ese documento de identidad');
    }
    throw error;
  }
}

export async function actualizarPaciente(id, data) {
  try {
    return await pacientesApi.update(`/Update/${id}`, data);
  } catch (error) {
    console.error(`Error al actualizar paciente ${id}:`, error);
    throw error
  }
}

export async function eliminarPaciente(id) {
  try {
    return await pacientesApi.delete(`${id}`);
  } catch (error) {
    console.error(`Error al eliminar paciente ${id}:`, error);
    throw error
  }
}
