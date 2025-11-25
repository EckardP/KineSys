import disponibilidadTerapeutaApi from "../api/disponibilidadTerapeutaApi";

export async function listarDisponibilidades() {
  try {
    return await disponibilidadTerapeutaApi.getAll();
  } catch (error) {
    console.error('Error al listar disponibilidades:', error);
    throw error;
  }
}

export async function obtenerDisponibilidad(id) {
  try {
    return await disponibilidadTerapeutaApi.getById(id);
  } catch (error) {
    console.error(`Error al obtener disponibilidad ${id}:`, error);
    throw error;
  }
}

export async function crearDisponibilidad(data) {
  try {
    return await disponibilidadTerapeutaApi.create('', data);
  } catch (error) {
    console.error('Error al crear disponibilidad:', error);
    throw error;
  }
}

export async function actualizarDisponibilidad(id, data) {
  try {
    // 🔥 IMPORTANTE: Pasar la URL completa con el ID
    return await disponibilidadTerapeutaApi.update(`/${id}`, data);
  } catch (error) {
    console.error(`Error al actualizar disponibilidad ${id}:`, error);
    throw error;
  }
}

export async function eliminarDisponibilidad(id) {
  try {
    return await disponibilidadTerapeutaApi.delete(id);
  } catch (error) {
    console.error(`Error al eliminar disponibilidad ${id}:`, error);
    throw error;
  }
}

// Funciones específicas para disponibilidad
export async function obtenerDisponibilidadPorTerapeuta(idTerapeuta) {
  try {
    // Esta función asume que tu API tiene un endpoint para filtrar por terapeuta
    // Si no existe, necesitarías implementarlo en el controller
    return await disponibilidadTerapeutaApi.getAll();
  } catch (error) {
    console.error(`Error al obtener disponibilidad del terapeuta ${idTerapeuta}:`, error);
    throw error;
  }
}

export async function verificarDisponibilidad(terapeutaId, diaSemana, horaInicio, horaFin) {
  try {
    // Esta función sería para verificar disponibilidad específica
    // Puedes adaptarla según las necesidades de tu aplicación
    const disponibilidades = await listarDisponibilidades();
    return disponibilidades.filter(disp => 
      disp.idTerapeuta === terapeutaId &&
      disp.diaSemana === diaSemana &&
      disp.disponible === true &&
      // Aquí puedes agregar lógica para verificar horarios
      disp.horaInicio <= horaInicio &&
      disp.horaFin >= horaFin
    );
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    throw error;
  }
}