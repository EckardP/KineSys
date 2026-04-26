import terapeutasApi from "../api/terapeutasApi";

export async function listarTerapeutas() {
  try {
    const todasLasPersonas = await terapeutasApi.getAll()
    return todasLasPersonas.filter(persona => persona.rol === 2)
  } catch (error) {
    console.error('Error al listar terapeutas:', error)
    throw error
  }
}

export async function obtenerTerapeuta(id) {
  try {
    const persona = await terapeutasApi.getById(id)
    if (persona.rol !== 2) {
      throw new Error('La persona encontrada no es un terapeuta')
    }
    return persona
  } catch (error) {
    console.error(`Error al obtener terapeuta ${id}:`, error)
    throw error
  }
}

export async function crearTerapeuta(data) {
  try {
    const datosCompletos = {
      ...data,
      activo: true,
      fechaRegistro: new Date().toISOString(),
      rol: 2,
    };

    return await terapeutasApi.create("/Register", datosCompletos);
  } catch (error) {
    console.error('Error al crear terapeuta:', error);
    if (error.message.includes('409') || error.response?.status === 409) {
      throw new Error('Ya existe un terapeuta con ese documento de identidad');
    }
    throw error;
  }
}

export async function actualizarTerapeuta(id, data) {
  try {
    const datosActualizacion = {
      ...data,
      rol: 2,
      noLicencia: data.noLicencia || "",
      tituloAcademico: data.tituloAcademico || "",
      añosExperiencia: data.añosExperiencia || 0,
      fechaContratacion: data.fechaContratacion || new Date().toISOString()
    };
    return await terapeutasApi.update(`/Update/${id}`, datosActualizacion);
  } catch (error) {
    console.error(`Error al actualizar terapeuta ${id}:`, error);
    throw error
  }
}

export async function eliminarTerapeuta(id) {
  try {
    return await terapeutasApi.delete(`${id}`);
  } catch (error) {
    console.error(`Error al eliminar terapeuta ${id}:`, error);
    throw error
  }
}

export async function obtenerTerapeutasActivos() {
  try {
    const terapeutas = await listarTerapeutas();
    return terapeutas.filter(terapeuta => terapeuta.activo === true);
  } catch (error) {
    console.error('Error al obtener terapeutas activos:', error);
    throw error
  }
}

export async function buscarTerapeutasPorEspecialidad(especialidad) {
  try {
    const terapeutas = await listarTerapeutas();
    return terapeutas.filter(terapeuta =>
      terapeuta.tituloAcademico?.toLowerCase().includes(especialidad.toLowerCase())
    );
  } catch (error) {
    console.error('Error al buscar terapeutas por especialidad:', error);
    throw error
  }
}
