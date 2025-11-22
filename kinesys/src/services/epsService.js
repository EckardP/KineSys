import epsApi from "../api/epsApi";

export async function listarEPS() {
  try {
    return await epsApi.getAll();
  } catch (error) {
    console.error('Error al listar EPS:', error);
    throw error;
  }
}

export async function obtenerEPS(id) {
  try {
    return await epsApi.getById(id);
  } catch (error) {
    console.error(`Error al obtener EPS ${id}:`, error);
    throw error;
  }
}

export async function crearEPS(data) {
  try {
    return await epsApi.create(data);
  } catch (error) {
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('Ya existe una EPS con ese nombre');
    }
    console.error('Error al crear EPS:', error);
    throw error;
  }
}

export async function actualizarEPS(id, data) {
  try {
    return await epsApi.update(id, data);
  } catch (error) {
    console.error(`Error al actualizar EPS ${id}:`, error);
    throw error;
  }
}

export async function eliminarEPS(id) {
  try {
    return await epsApi.delete(id);
  } catch (error) {
    console.error(`Error al eliminar EPS ${id}:`, error);
    throw error;
  }
}