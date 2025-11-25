import equiposRequeridosApi from "../api/equiposRequeridosApi";

export async function listarEquiposRequeridos() {
  try {
    console.log("🔄 Servicio: Listando equipos requeridos...");
    const equiposRequeridos = await equiposRequeridosApi.getAll();
    console.log("✅ Servicio: Equipos requeridos obtenidos:", equiposRequeridos);
    return equiposRequeridos;
  } catch (error) {
    console.error('❌ Servicio: Error al listar equipos requeridos:', error);
    throw error;
  }
}

export async function obtenerEquipoRequerido(id) {
  try {
    console.log(`🔄 Servicio: Obteniendo equipo requerido ${id}...`);
    const equipoRequerido = await equiposRequeridosApi.getById(id);
    console.log("✅ Servicio: Equipo requerido obtenido:", equipoRequerido);
    return equipoRequerido;
  } catch (error) {
    console.error(`❌ Servicio: Error al obtener equipo requerido ${id}:`, error);
    throw error;
  }
}

export async function crearEquipoRequerido(data) {
  try {
    console.log("🔄 Servicio: Creando equipo requerido con datos:", data);
    
    const datosCompletos = {
      idEquipoRequerido: 0, // El backend lo asignará automáticamente
      idTipoServicio: data.idTipoServicio || 0,
      idEquipo: data.idEquipo || 0,
      cantidadRequerida: data.cantidadRequerida || 1,
      esObligatorio: data.esObligatorio !== undefined ? data.esObligatorio : true
    };

    // Validaciones básicas
    if (!datosCompletos.idTipoServicio || datosCompletos.idTipoServicio === 0) {
      throw new Error('El ID del tipo de servicio es requerido');
    }

    if (!datosCompletos.idEquipo || datosCompletos.idEquipo === 0) {
      throw new Error('El ID del equipo es requerido');
    }

    const resultado = await equiposRequeridosApi.create('', datosCompletos);
    console.log("✅ Servicio: Equipo requerido creado exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Servicio: Error al crear equipo requerido:', error);
    
    // Manejo específico de errores
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('Ya existe una relación entre este tipo de servicio y equipo');
    }
    
    throw error;
  }
}

export async function actualizarEquipoRequerido(id, data) {
  try {
    console.log(`🔄 Servicio: Actualizando equipo requerido ${id} con datos:`, data);
    
    const datosActualizacion = {
      idEquipoRequerido: id,
      idTipoServicio: data.idTipoServicio || 0,
      idEquipo: data.idEquipo || 0,
      cantidadRequerida: data.cantidadRequerida || 1,
      esObligatorio: data.esObligatorio !== undefined ? data.esObligatorio : true
    };

    // Validaciones básicas
    if (!datosActualizacion.idTipoServicio || datosActualizacion.idTipoServicio === 0) {
      throw new Error('El ID del tipo de servicio es requerido');
    }

    if (!datosActualizacion.idEquipo || datosActualizacion.idEquipo === 0) {
      throw new Error('El ID del equipo es requerido');
    }
    
    const resultado = await equiposRequeridosApi.update(`/${id}`, datosActualizacion);
    console.log("✅ Servicio: Equipo requerido actualizado exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al actualizar equipo requerido ${id}:`, error);
    throw error;
  }
}

export async function eliminarEquipoRequerido(id) {
  try {
    console.log(`🔄 Servicio: Eliminando equipo requerido ${id}...`);
    const resultado = await equiposRequeridosApi.delete(id);
    console.log("✅ Servicio: Equipo requerido eliminado exitosamente");
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al eliminar equipo requerido ${id}:`, error);
    
    // Manejo específico para cuando no se puede eliminar por relaciones
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('No se puede eliminar el equipo requerido porque está en uso');
    }
    
    throw error;
  }
}

// Funciones adicionales útiles para equipos requeridos
export async function obtenerEquiposRequeridosPorTipoServicio(idTipoServicio) {
  try {
    console.log(`🔍 Servicio: Obteniendo equipos requeridos para tipo servicio ${idTipoServicio}...`);
    const equiposRequeridos = await listarEquiposRequeridos();
    const resultados = equiposRequeridos.filter(er => 
      er.idTipoServicio === idTipoServicio
    );
    console.log("✅ Servicio: Equipos requeridos por tipo servicio:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener equipos requeridos por tipo servicio:', error);
    throw error;
  }
}

export async function obtenerEquiposRequeridosPorEquipo(idEquipo) {
  try {
    console.log(`🔍 Servicio: Obteniendo tipos de servicio que requieren equipo ${idEquipo}...`);
    const equiposRequeridos = await listarEquiposRequeridos();
    const resultados = equiposRequeridos.filter(er => 
      er.idEquipo === idEquipo
    );
    console.log("✅ Servicio: Tipos de servicio que requieren el equipo:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener tipos de servicio por equipo:', error);
    throw error;
  }
}

export async function obtenerEquiposObligatoriosPorTipoServicio(idTipoServicio) {
  try {
    console.log(`🔍 Servicio: Obteniendo equipos obligatorios para tipo servicio ${idTipoServicio}...`);
    const equiposRequeridos = await obtenerEquiposRequeridosPorTipoServicio(idTipoServicio);
    const resultados = equiposRequeridos.filter(er => 
      er.esObligatorio === true
    );
    console.log("✅ Servicio: Equipos obligatorios por tipo servicio:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener equipos obligatorios por tipo servicio:', error);
    throw error;
  }
}

export async function obtenerEquiposOpcionalesPorTipoServicio(idTipoServicio) {
  try {
    console.log(`🔍 Servicio: Obteniendo equipos opcionales para tipo servicio ${idTipoServicio}...`);
    const equiposRequeridos = await obtenerEquiposRequeridosPorTipoServicio(idTipoServicio);
    const resultados = equiposRequeridos.filter(er => 
      er.esObligatorio === false
    );
    console.log("✅ Servicio: Equipos opcionales por tipo servicio:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener equipos opcionales por tipo servicio:', error);
    throw error;
  }
}

export async function verificarEquipoRequeridoExistente(idTipoServicio, idEquipo) {
  try {
    console.log(`🔍 Servicio: Verificando si el equipo ${idEquipo} ya está requerido para tipo servicio ${idTipoServicio}...`);
    const equiposRequeridos = await listarEquiposRequeridos();
    const existe = equiposRequeridos.some(er => 
      er.idTipoServicio === idTipoServicio && er.idEquipo === idEquipo
    );
    console.log(`✅ Servicio: Equipo requerido existe:`, existe);
    return existe;
  } catch (error) {
    console.error('❌ Servicio: Error al verificar existencia de equipo requerido:', error);
    throw error;
  }
}

export async function actualizarCantidadRequerida(id, nuevaCantidad) {
  try {
    console.log(`🔄 Servicio: Actualizando cantidad requerida para equipo requerido ${id} a ${nuevaCantidad}...`);
    
    // Primero obtener el equipo requerido actual
    const equipoRequerido = await obtenerEquipoRequerido(id);
    
    // Actualizar solo la cantidad
    const datosActualizacion = {
      idTipoServicio: equipoRequerido.idTipoServicio,
      idEquipo: equipoRequerido.idEquipo,
      cantidadRequerida: nuevaCantidad,
      esObligatorio: equipoRequerido.esObligatorio
    };
    
    return await actualizarEquipoRequerido(id, datosActualizacion);
  } catch (error) {
    console.error(`❌ Servicio: Error al actualizar cantidad requerida:`, error);
    throw error;
  }
}

export async function toggleObligatorio(id) {
  try {
    console.log(`🔄 Servicio: Cambiando estado obligatorio para equipo requerido ${id}...`);
    
    // Primero obtener el equipo requerido actual
    const equipoRequerido = await obtenerEquipoRequerido(id);
    
    // Cambiar el estado de obligatorio
    const datosActualizacion = {
      idTipoServicio: equipoRequerido.idTipoServicio,
      idEquipo: equipoRequerido.idEquipo,
      cantidadRequerida: equipoRequerido.cantidadRequerida,
      esObligatorio: !equipoRequerido.esObligatorio
    };
    
    return await actualizarEquipoRequerido(id, datosActualizacion);
  } catch (error) {
    console.error(`❌ Servicio: Error al cambiar estado obligatorio:`, error);
    throw error;
  }
}