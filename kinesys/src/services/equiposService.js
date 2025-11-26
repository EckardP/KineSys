import equiposApi from "../api/equiposApi";

export async function listarEquipos() {
  try {
    console.log("🔄 Servicio: Listando equipos...");
    const equipos = await equiposApi.getAll();
    console.log("✅ Servicio: Equipos obtenidos:", equipos);
    return equipos;
  } catch (error) {
    console.error('❌ Servicio: Error al listar equipos:', error);
    throw error;
  }
}

export async function obtenerEquipo(id) {
  try {
    console.log(`🔄 Servicio: Obteniendo equipo ${id}...`);
    const equipo = await equiposApi.getById(id);
    console.log("✅ Servicio: Equipo obtenido:", equipo);
    return equipo;
  } catch (error) {
    console.error(`❌ Servicio: Error al obtener equipo ${id}:`, error);
    throw error;
  }
}

export async function crearEquipo(data) {
  try {
    console.log("🔄 Servicio: Creando equipo con datos:", data);
    
    const datosCompletos = {
      idEquipo: 0, // El backend lo asignará automáticamente
      nombreEquipo: data.nombreEquipo || "",
      descripcion: data.descripcion || "",
      estado: data.estado || "Disponible",
      cantidad: data.cantidad || 1,
      ubicacion: data.ubicacion || ""
    };

    const resultado = await equiposApi.create('', datosCompletos);
    console.log("✅ Servicio: Equipo creado exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Servicio: Error al crear equipo:', error);
    
    // Manejo específico de errores
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('Ya existe un equipo con ese nombre');
    }
    
    throw error;
  }
}

export async function actualizarEquipo(id, data) {
  try {
    console.log(`🔄 Servicio: Actualizando equipo ${id} con datos:`, data);
    
    const datosActualizacion = {
      idEquipo: id,
      nombreEquipo: data.nombreEquipo || "",
      descripcion: data.descripcion || "",
      estado: data.estado || "Disponible",
      cantidad: data.cantidad || 1,
      ubicacion: data.ubicacion || ""
    };
    
    const resultado = await equiposApi.update(`/${id}`, datosActualizacion);
    console.log("✅ Servicio: Equipo actualizado exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al actualizar equipo ${id}:`, error);
    throw error;
  }
}

export async function eliminarEquipo(id) {
  try {
    console.log(`🔄 Servicio: Eliminando equipo ${id}...`);
    const resultado = await equiposApi.delete(id);
    console.log("✅ Servicio: Equipo eliminado exitosamente");
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al eliminar equipo ${id}:`, error);
    
    // Manejo específico para cuando no se puede eliminar por relaciones
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('No se puede eliminar el equipo porque está en uso');
    }
    
    throw error;
  }
}

// Funciones adicionales útiles para equipos
export async function buscarEquiposPorNombre(nombre) {
  try {
    console.log(`🔍 Servicio: Buscando equipos por nombre: ${nombre}`);
    const equipos = await listarEquipos();
    const resultados = equipos.filter(equipo => 
      equipo.nombreEquipo.toLowerCase().includes(nombre.toLowerCase())
    );
    console.log("✅ Servicio: Equipos encontrados:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al buscar equipos por nombre:', error);
    throw error;
  }
}

export async function filtrarEquiposPorEstado(estado) {
  try {
    console.log(`🔍 Servicio: Filtrando equipos por estado: ${estado}`);
    const equipos = await listarEquipos();
    const resultados = equipos.filter(equipo => 
      equipo.estado.toLowerCase() === estado.toLowerCase()
    );
    console.log("✅ Servicio: Equipos filtrados por estado:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al filtrar equipos por estado:', error);
    throw error;
  }
}

export async function filtrarEquiposPorUbicacion(ubicacion) {
  try {
    console.log(`🔍 Servicio: Filtrando equipos por ubicación: ${ubicacion}`);
    const equipos = await listarEquipos();
    const resultados = equipos.filter(equipo => 
      equipo.ubicacion.toLowerCase().includes(ubicacion.toLowerCase())
    );
    console.log("✅ Servicio: Equipos filtrados por ubicación:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al filtrar equipos por ubicación:', error);
    throw error;
  }
}

export async function obtenerEquiposDisponibles() {
  try {
    console.log("🔍 Servicio: Obteniendo equipos disponibles...");
    return await filtrarEquiposPorEstado("Disponible");
  } catch (error) {
    console.error('❌ Servicio: Error al obtener equipos disponibles:', error);
    throw error;
  }
}

export async function obtenerEquiposEnUso() {
  try {
    console.log("🔍 Servicio: Obteniendo equipos en uso...");
    return await filtrarEquiposPorEstado("En Uso");
  } catch (error) {
    console.error('❌ Servicio: Error al obtener equipos en uso:', error);
    throw error;
  }
}

export async function obtenerEquiposEnMantenimiento() {
  try {
    console.log("🔍 Servicio: Obteniendo equipos en mantenimiento...");
    return await filtrarEquiposPorEstado("Mantenimiento");
  } catch (error) {
    console.error('❌ Servicio: Error al obtener equipos en mantenimiento:', error);
    throw error;
  }
}

export async function verificarEquipoExistente(nombreEquipo) {
  try {
    console.log(`🔍 Servicio: Verificando existencia de equipo: ${nombreEquipo}`);
    const equipos = await listarEquipos();
    const existe = equipos.some(equipo => 
      equipo.nombreEquipo.toLowerCase() === nombreEquipo.toLowerCase()
    );
    console.log(`✅ Servicio: Equipo "${nombreEquipo}" existe:`, existe);
    return existe;
  } catch (error) {
    console.error('❌ Servicio: Error al verificar existencia de equipo:', error);
    throw error;
  }
}