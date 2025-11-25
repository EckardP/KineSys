import tipoServicioEspecialidadesApi from "../api/tipoServicioEspecialidadesApi";

export async function listarTipoServicioEspecialidades() {
  try {
    console.log("🔄 Servicio: Listando relaciones tipo servicio-especialidad...");
    const relaciones = await tipoServicioEspecialidadesApi.getAll();
    console.log("✅ Servicio: Relaciones tipo servicio-especialidad obtenidas:", relaciones);
    return relaciones;
  } catch (error) {
    console.error('❌ Servicio: Error al listar relaciones tipo servicio-especialidad:', error);
    throw error;
  }
}

export async function obtenerTipoServicioEspecialidad(id) {
  try {
    console.log(`🔄 Servicio: Obteniendo relación tipo servicio-especialidad ${id}...`);
    const relacion = await tipoServicioEspecialidadesApi.getById(id);
    console.log("✅ Servicio: Relación tipo servicio-especialidad obtenida:", relacion);
    return relacion;
  } catch (error) {
    console.error(`❌ Servicio: Error al obtener relación tipo servicio-especialidad ${id}:`, error);
    throw error;
  }
}

export async function crearTipoServicioEspecialidad(data) {
  try {
    console.log("🔄 Servicio: Creando relación tipo servicio-especialidad con datos:", data);
    
    const datosCompletos = {
      idTipoServicioEspecialidad: 0, // El backend lo asignará automáticamente
      idTipoServicio: data.idTipoServicio || 0,
      idEspecialidad: data.idEspecialidad || 0,
      esObligatoria: data.esObligatoria !== undefined ? data.esObligatoria : true
    };

    // Validaciones básicas
    if (!datosCompletos.idTipoServicio || datosCompletos.idTipoServicio === 0) {
      throw new Error('El ID del tipo de servicio es requerido');
    }

    if (!datosCompletos.idEspecialidad || datosCompletos.idEspecialidad === 0) {
      throw new Error('El ID de la especialidad es requerido');
    }

    const resultado = await tipoServicioEspecialidadesApi.create('', datosCompletos);
    console.log("✅ Servicio: Relación tipo servicio-especialidad creada exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Servicio: Error al crear relación tipo servicio-especialidad:', error);
    
    // Manejo específico de errores
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('Ya existe una relación entre este tipo de servicio y especialidad');
    }
    
    throw error;
  }
}

export async function actualizarTipoServicioEspecialidad(id, data) {
  try {
    console.log(`🔄 Servicio: Actualizando relación tipo servicio-especialidad ${id} con datos:`, data);
    
    const datosActualizacion = {
      idTipoServicioEspecialidad: id,
      idTipoServicio: data.idTipoServicio || 0,
      idEspecialidad: data.idEspecialidad || 0,
      esObligatoria: data.esObligatoria !== undefined ? data.esObligatoria : true
    };

    // Validaciones básicas
    if (!datosActualizacion.idTipoServicio || datosActualizacion.idTipoServicio === 0) {
      throw new Error('El ID del tipo de servicio es requerido');
    }

    if (!datosActualizacion.idEspecialidad || datosActualizacion.idEspecialidad === 0) {
      throw new Error('El ID de la especialidad es requerido');
    }
    
    const resultado = await tipoServicioEspecialidadesApi.update(`/${id}`, datosActualizacion);
    console.log("✅ Servicio: Relación tipo servicio-especialidad actualizada exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al actualizar relación tipo servicio-especialidad ${id}:`, error);
    throw error;
  }
}

export async function eliminarTipoServicioEspecialidad(id) {
  try {
    console.log(`🔄 Servicio: Eliminando relación tipo servicio-especialidad ${id}...`);
    const resultado = await tipoServicioEspecialidadesApi.delete(id);
    console.log("✅ Servicio: Relación tipo servicio-especialidad eliminada exitosamente");
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al eliminar relación tipo servicio-especialidad ${id}:`, error);
    
    // Manejo específico para cuando no se puede eliminar por relaciones
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('No se puede eliminar la relación porque está en uso');
    }
    
    throw error;
  }
}

// Funciones adicionales útiles para relaciones tipo servicio-especialidad
export async function obtenerEspecialidadesPorTipoServicio(idTipoServicio) {
  try {
    console.log(`🔍 Servicio: Obteniendo especialidades para tipo servicio ${idTipoServicio}...`);
    const relaciones = await listarTipoServicioEspecialidades();
    const resultados = relaciones.filter(relacion => 
      relacion.idTipoServicio === idTipoServicio
    );
    console.log("✅ Servicio: Especialidades por tipo servicio:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener especialidades por tipo servicio:', error);
    throw error;
  }
}

export async function obtenerTiposServicioPorEspecialidad(idEspecialidad) {
  try {
    console.log(`🔍 Servicio: Obteniendo tipos de servicio para especialidad ${idEspecialidad}...`);
    const relaciones = await listarTipoServicioEspecialidades();
    const resultados = relaciones.filter(relacion => 
      relacion.idEspecialidad === idEspecialidad
    );
    console.log("✅ Servicio: Tipos de servicio por especialidad:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener tipos de servicio por especialidad:', error);
    throw error;
  }
}

export async function obtenerEspecialidadesObligatoriasPorTipoServicio(idTipoServicio) {
  try {
    console.log(`🔍 Servicio: Obteniendo especialidades obligatorias para tipo servicio ${idTipoServicio}...`);
    const especialidades = await obtenerEspecialidadesPorTipoServicio(idTipoServicio);
    const resultados = especialidades.filter(relacion => 
      relacion.esObligatoria === true
    );
    console.log("✅ Servicio: Especialidades obligatorias por tipo servicio:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener especialidades obligatorias por tipo servicio:', error);
    throw error;
  }
}

export async function obtenerEspecialidadesOpcionalesPorTipoServicio(idTipoServicio) {
  try {
    console.log(`🔍 Servicio: Obteniendo especialidades opcionales para tipo servicio ${idTipoServicio}...`);
    const especialidades = await obtenerEspecialidadesPorTipoServicio(idTipoServicio);
    const resultados = especialidades.filter(relacion => 
      relacion.esObligatoria === false
    );
    console.log("✅ Servicio: Especialidades opcionales por tipo servicio:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener especialidades opcionales por tipo servicio:', error);
    throw error;
  }
}

export async function verificarRelacionExistente(idTipoServicio, idEspecialidad) {
  try {
    console.log(`🔍 Servicio: Verificando si la relación tipo servicio ${idTipoServicio} - especialidad ${idEspecialidad} ya existe...`);
    const relaciones = await listarTipoServicioEspecialidades();
    const existe = relaciones.some(relacion => 
      relacion.idTipoServicio === idTipoServicio && 
      relacion.idEspecialidad === idEspecialidad
    );
    console.log(`✅ Servicio: Relación existe:`, existe);
    return existe;
  } catch (error) {
    console.error('❌ Servicio: Error al verificar existencia de relación:', error);
    throw error;
  }
}

export async function toggleObligatoria(id) {
  try {
    console.log(`🔄 Servicio: Cambiando estado obligatorio para relación ${id}...`);
    
    // Primero obtener la relación actual
    const relacion = await obtenerTipoServicioEspecialidad(id);
    
    // Cambiar el estado de obligatoria
    const datosActualizacion = {
      idTipoServicio: relacion.idTipoServicio,
      idEspecialidad: relacion.idEspecialidad,
      esObligatoria: !relacion.esObligatoria
    };
    
    return await actualizarTipoServicioEspecialidad(id, datosActualizacion);
  } catch (error) {
    console.error(`❌ Servicio: Error al cambiar estado obligatorio:`, error);
    throw error;
  }
}

export async function agregarEspecialidadATipoServicio(idTipoServicio, idEspecialidad, esObligatoria = true) {
  try {
    console.log(`🔄 Servicio: Agregando especialidad ${idEspecialidad} a tipo servicio ${idTipoServicio}...`);
    
    // Verificar si ya existe la relación
    const existe = await verificarRelacionExistente(idTipoServicio, idEspecialidad);
    if (existe) {
      throw new Error('La relación entre este tipo de servicio y especialidad ya existe');
    }
    
    const datos = {
      idTipoServicio: idTipoServicio,
      idEspecialidad: idEspecialidad,
      esObligatoria: esObligatoria
    };
    
    return await crearTipoServicioEspecialidad(datos);
  } catch (error) {
    console.error(`❌ Servicio: Error al agregar especialidad a tipo servicio:`, error);
    throw error;
  }
}

export async function eliminarRelacionPorIds(idTipoServicio, idEspecialidad) {
  try {
    console.log(`🔄 Servicio: Eliminando relación tipo servicio ${idTipoServicio} - especialidad ${idEspecialidad}...`);
    
    const relaciones = await listarTipoServicioEspecialidades();
    const relacion = relaciones.find(rel => 
      rel.idTipoServicio === idTipoServicio && 
      rel.idEspecialidad === idEspecialidad
    );
    
    if (!relacion) {
      throw new Error('No se encontró la relación especificada');
    }
    
    return await eliminarTipoServicioEspecialidad(relacion.idTipoServicioEspecialidad);
  } catch (error) {
    console.error(`❌ Servicio: Error al eliminar relación por IDs:`, error);
    throw error;
  }
}

export async function obtenerTipoServiciosCompatibleConEspecialidad(idEspecialidad) {
  try {
    console.log(`🔍 Servicio: Obteniendo tipos de servicio compatibles con especialidad ${idEspecialidad}...`);
    return await obtenerTiposServicioPorEspecialidad(idEspecialidad);
  } catch (error) {
    console.error('❌ Servicio: Error al obtener tipos de servicio compatibles:', error);
    throw error;
  }
}