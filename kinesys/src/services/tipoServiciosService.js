import tipoServiciosApi from "../api/tipoServiciosApi";

export async function listarTipoServicios() {
  try {
    console.log("🔄 Servicio: Listando tipos de servicio...");
    const tiposServicio = await tipoServiciosApi.getAll();
    console.log("✅ Servicio: Tipos de servicio obtenidos:", tiposServicio);
    return tiposServicio;
  } catch (error) {
    console.error('❌ Servicio: Error al listar tipos de servicio:', error);
    throw error;
  }
}

export async function obtenerTipoServicio(id) {
  try {
    console.log(`🔄 Servicio: Obteniendo tipo de servicio ${id}...`);
    const tipoServicio = await tipoServiciosApi.getById(id);
    console.log("✅ Servicio: Tipo de servicio obtenido:", tipoServicio);
    return tipoServicio;
  } catch (error) {
    console.error(`❌ Servicio: Error al obtener tipo de servicio ${id}:`, error);
    throw error;
  }
}

export async function crearTipoServicio(data) {
  try {
    console.log("🔄 Servicio: Creando tipo de servicio con datos:", data);
    
    const datosCompletos = {
      idTipoServicio: 0, // El backend lo asignará automáticamente
      nombreServicio: data.nombreServicio || "",
      descripcion: data.descripcion || "",
      duracionEstandarMin: data.duracionEstandarMin || 30,
      tipoSalaNecesaria: data.tipoSalaNecesaria || "General",
      precio: data.precio || 0,
      compatibleConEPS: data.compatibleConEPS !== undefined ? data.compatibleConEPS : true,
      compatibleConPrepagadas: data.compatibleConPrepagadas !== undefined ? data.compatibleConPrepagadas : true,
      documentosNecesarios: data.documentosNecesarios || ""
    };

    // Validaciones básicas
    if (!datosCompletos.nombreServicio.trim()) {
      throw new Error('El nombre del servicio es requerido');
    }

    if (datosCompletos.duracionEstandarMin <= 0) {
      throw new Error('La duración estándar debe ser mayor a 0');
    }

    const resultado = await tipoServiciosApi.create('', datosCompletos);
    console.log("✅ Servicio: Tipo de servicio creado exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Servicio: Error al crear tipo de servicio:', error);
    
    // Manejo específico de errores
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('Ya existe un tipo de servicio con ese nombre');
    }
    
    throw error;
  }
}

export async function actualizarTipoServicio(id, data) {
  try {
    console.log(`🔄 Servicio: Actualizando tipo de servicio ${id} con datos:`, data);
    
    const datosActualizacion = {
      idTipoServicio: id,
      nombreServicio: data.nombreServicio || "",
      descripcion: data.descripcion || "",
      duracionEstandarMin: data.duracionEstandarMin || 30,
      tipoSalaNecesaria: data.tipoSalaNecesaria || "General",
      precio: data.precio || 0,
      compatibleConEPS: data.compatibleConEPS !== undefined ? data.compatibleConEPS : true,
      compatibleConPrepagadas: data.compatibleConPrepagadas !== undefined ? data.compatibleConPrepagadas : true,
      documentosNecesarios: data.documentosNecesarios || ""
    };

    // Validaciones básicas
    if (!datosActualizacion.nombreServicio.trim()) {
      throw new Error('El nombre del servicio es requerido');
    }

    if (datosActualizacion.duracionEstandarMin <= 0) {
      throw new Error('La duración estándar debe ser mayor a 0');
    }
    
    const resultado = await tipoServiciosApi.update(`/${id}`, datosActualizacion);
    console.log("✅ Servicio: Tipo de servicio actualizado exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al actualizar tipo de servicio ${id}:`, error);
    throw error;
  }
}

export async function eliminarTipoServicio(id) {
  try {
    console.log(`🔄 Servicio: Eliminando tipo de servicio ${id}...`);
    const resultado = await tipoServiciosApi.delete(id);
    console.log("✅ Servicio: Tipo de servicio eliminado exitosamente");
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al eliminar tipo de servicio ${id}:`, error);
    
    // Manejo específico para cuando no se puede eliminar por relaciones
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('No se puede eliminar el tipo de servicio porque está asociado a citas o equipos');
    }
    
    throw error;
  }
}

// Funciones adicionales útiles para tipos de servicio
export async function buscarTipoServiciosPorNombre(nombre) {
  try {
    console.log(`🔍 Servicio: Buscando tipos de servicio por nombre: ${nombre}`);
    const tiposServicio = await listarTipoServicios();
    const resultados = tiposServicio.filter(servicio => 
      servicio.nombreServicio.toLowerCase().includes(nombre.toLowerCase())
    );
    console.log("✅ Servicio: Tipos de servicio encontrados:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al buscar tipos de servicio por nombre:', error);
    throw error;
  }
}

export async function filtrarTipoServiciosPorCompatibilidadEPS() {
  try {
    console.log("🔍 Servicio: Filtrando tipos de servicio compatibles con EPS...");
    const tiposServicio = await listarTipoServicios();
    const resultados = tiposServicio.filter(servicio => 
      servicio.compatibleConEPS === true
    );
    console.log("✅ Servicio: Tipos de servicio compatibles con EPS:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al filtrar tipos de servicio por compatibilidad EPS:', error);
    throw error;
  }
}

export async function filtrarTipoServiciosPorCompatibilidadPrepagadas() {
  try {
    console.log("🔍 Servicio: Filtrando tipos de servicio compatibles con prepagadas...");
    const tiposServicio = await listarTipoServicios();
    const resultados = tiposServicio.filter(servicio => 
      servicio.compatibleConPrepagadas === true
    );
    console.log("✅ Servicio: Tipos de servicio compatibles con prepagadas:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al filtrar tipos de servicio por compatibilidad prepagadas:', error);
    throw error;
  }
}

export async function filtrarTipoServiciosPorTipoSala(tipoSala) {
  try {
    console.log(`🔍 Servicio: Filtrando tipos de servicio por tipo de sala: ${tipoSala}`);
    const tiposServicio = await listarTipoServicios();
    const resultados = tiposServicio.filter(servicio => 
      servicio.tipoSalaNecesaria.toLowerCase() === tipoSala.toLowerCase()
    );
    console.log("✅ Servicio: Tipos de servicio por tipo de sala:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al filtrar tipos de servicio por tipo de sala:', error);
    throw error;
  }
}

export async function filtrarTipoServiciosPorDuracion(duracionMinima, duracionMaxima) {
  try {
    console.log(`🔍 Servicio: Filtrando tipos de servicio por duración entre ${duracionMinima} y ${duracionMaxima} minutos...`);
    const tiposServicio = await listarTipoServicios();
    const resultados = tiposServicio.filter(servicio => 
      servicio.duracionEstandarMin >= duracionMinima && 
      servicio.duracionEstandarMin <= duracionMaxima
    );
    console.log("✅ Servicio: Tipos de servicio filtrados por duración:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al filtrar tipos de servicio por duración:', error);
    throw error;
  }
}

export async function filtrarTipoServiciosPorPrecio(precioMinimo, precioMaximo) {
  try {
    console.log(`🔍 Servicio: Filtrando tipos de servicio por precio entre ${precioMinimo} y ${precioMaximo}...`);
    const tiposServicio = await listarTipoServicios();
    const resultados = tiposServicio.filter(servicio => 
      servicio.precio >= precioMinimo && 
      servicio.precio <= precioMaximo
    );
    console.log("✅ Servicio: Tipos de servicio filtrados por precio:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al filtrar tipos de servicio por precio:', error);
    throw error;
  }
}

export async function obtenerServiciosCortos() {
  try {
    console.log("🔍 Servicio: Obteniendo servicios cortos (menos de 30 minutos)...");
    return await filtrarTipoServiciosPorDuracion(1, 29);
  } catch (error) {
    console.error('❌ Servicio: Error al obtener servicios cortos:', error);
    throw error;
  }
}

export async function obtenerServiciosLargos() {
  try {
    console.log("🔍 Servicio: Obteniendo servicios largos (más de 60 minutos)...");
    return await filtrarTipoServiciosPorDuracion(61, 999);
  } catch (error) {
    console.error('❌ Servicio: Error al obtener servicios largos:', error);
    throw error;
  }
}

export async function verificarTipoServicioExistente(nombreServicio) {
  try {
    console.log(`🔍 Servicio: Verificando existencia de tipo de servicio: ${nombreServicio}`);
    const tiposServicio = await listarTipoServicios();
    const existe = tiposServicio.some(servicio => 
      servicio.nombreServicio.toLowerCase() === nombreServicio.toLowerCase()
    );
    console.log(`✅ Servicio: Tipo de servicio "${nombreServicio}" existe:`, existe);
    return existe;
  } catch (error) {
    console.error('❌ Servicio: Error al verificar existencia de tipo de servicio:', error);
    throw error;
  }
}

export async function obtenerTiposSalaDisponibles() {
  try {
    console.log("🔍 Servicio: Obteniendo tipos de sala únicos...");
    const tiposServicio = await listarTipoServicios();
    const tiposSala = [...new Set(tiposServicio.map(servicio => servicio.tipoSalaNecesaria))];
    console.log("✅ Servicio: Tipos de sala disponibles:", tiposSala);
    return tiposSala;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener tipos de sala:', error);
    throw error;
  }
}