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

// 🔥 NUEVA FUNCIÓN: Obtener disponibilidad por terapeuta usando el nuevo endpoint
export async function obtenerDisponibilidadPorTerapeuta(idTerapeuta) {
  try {
    return await disponibilidadTerapeutaApi.getAllCustom(`/por-terapeuta/${idTerapeuta}`);
  } catch (error) {
    console.error(`Error al obtener disponibilidad del terapeuta ${idTerapeuta}:`, error);
    throw error;
  }
}

export async function verificarDisponibilidad(terapeutaId, diaSemana, horaInicio, horaFin) {
  try {
    // 🔥 MODIFICADO: Usar la nueva función para obtener solo las disponibilidades del terapeuta
    const disponibilidades = await obtenerDisponibilidadPorTerapeuta(terapeutaId);
    
    return disponibilidades.filter(disp => 
      disp.diaSemana === diaSemana &&
      disp.disponible === true &&
      // Convertir TimeSpan a string para comparación (formato "HH:MM:SS")
      disp.horaInicio <= horaInicio &&
      disp.horaFin >= horaFin
    );
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    throw error;
  }
}

// 🔥 NUEVA FUNCIÓN: Obtener disponibilidad por terapeuta y día específico
export async function obtenerDisponibilidadPorTerapeutaYDia(idTerapeuta, diaSemana) {
  try {
    const disponibilidades = await obtenerDisponibilidadPorTerapeuta(idTerapeuta);
    return disponibilidades.filter(disp => 
      disp.diaSemana === diaSemana && 
      disp.disponible === true
    );
  } catch (error) {
    console.error(`Error al obtener disponibilidad del terapeuta ${idTerapeuta} para el día ${diaSemana}:`, error);
    throw error;
  }
}

// 🔥 NUEVA FUNCIÓN: Obtener horarios disponibles por terapeuta, día y tipo de ambiente
export async function obtenerHorariosDisponibles(idTerapeuta, diaSemana, tipoAmbiente = null) {
  try {
    const disponibilidades = await obtenerDisponibilidadPorTerapeuta(idTerapeuta);
    
    return disponibilidades.filter(disp => 
      disp.diaSemana === diaSemana &&
      disp.disponible === true &&
      (tipoAmbiente === null || disp.tipoAmbiente === tipoAmbiente)
    );
  } catch (error) {
    console.error(`Error al obtener horarios disponibles:`, error);
    throw error;
  }
}