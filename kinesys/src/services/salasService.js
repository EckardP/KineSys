import salasApi from "../api/salasApi";

export async function listarSalas() {
  try {
    console.log("🔄 Servicio: Listando salas...");
    const salas = await salasApi.getAll();
    console.log("✅ Servicio: Salas obtenidas:", salas);
    return salas;
  } catch (error) {
    console.error('❌ Servicio: Error al listar salas:', error);
    throw error;
  }
}

export async function obtenerSala(id) {
  try {
    console.log(`🔄 Servicio: Obteniendo sala ${id}...`);
    const sala = await salasApi.getById(id);
    console.log("✅ Servicio: Sala obtenida:", sala);
    return sala;
  } catch (error) {
    console.error(`❌ Servicio: Error al obtener sala ${id}:`, error);
    throw error;
  }
}

export async function crearSala(data) {
  try {
    console.log("🔄 Servicio: Creando sala con datos:", data);
    
    const datosCompletos = {
      idSala: 0, // El backend lo asignará automáticamente
      nombre: data.nombre || "",
      tipo: data.tipo || "Consulta",
      estado: data.estado || "Disponible",
      capacidad: data.capacidad || 1,
      ubicacion: data.ubicacion || "",
      descripcion: data.descripcion || ""
    };

    // Validaciones básicas
    if (!datosCompletos.nombre.trim()) {
      throw new Error('El nombre de la sala es requerido');
    }

    const resultado = await salasApi.create('', datosCompletos);
    console.log("✅ Servicio: Sala creada exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Servicio: Error al crear sala:', error);
    
    // Manejo específico de errores
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('Ya existe una sala con ese nombre');
    }
    
    throw error;
  }
}

export async function actualizarSala(id, data) {
  try {
    console.log(`🔄 Servicio: Actualizando sala ${id} con datos:`, data);
    
    const datosActualizacion = {
      idSala: id,
      nombre: data.nombre || "",
      tipo: data.tipo || "Consulta",
      estado: data.estado || "Disponible",
      capacidad: data.capacidad || 1,
      ubicacion: data.ubicacion || "",
      descripcion: data.descripcion || ""
    };

    // Validaciones básicas
    if (!datosActualizacion.nombre.trim()) {
      throw new Error('El nombre de la sala es requerido');
    }
    
    const resultado = await salasApi.update(`/${id}`, datosActualizacion);
    console.log("✅ Servicio: Sala actualizada exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al actualizar sala ${id}:`, error);
    throw error;
  }
}

export async function eliminarSala(id) {
  try {
    console.log(`🔄 Servicio: Eliminando sala ${id}...`);
    const resultado = await salasApi.delete(id);
    console.log("✅ Servicio: Sala eliminada exitosamente");
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al eliminar sala ${id}:`, error);
    
    // Manejo específico para cuando no se puede eliminar por relaciones
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('No se puede eliminar la sala porque está asociada a citas');
    }
    
    throw error;
  }
}

// Funciones adicionales útiles para salas
export async function buscarSalasPorNombre(nombre) {
  try {
    console.log(`🔍 Servicio: Buscando salas por nombre: ${nombre}`);
    const salas = await listarSalas();
    const resultados = salas.filter(sala => 
      sala.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
    console.log("✅ Servicio: Salas encontradas:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al buscar salas por nombre:', error);
    throw error;
  }
}

export async function filtrarSalasPorTipo(tipo) {
  try {
    console.log(`🔍 Servicio: Filtrando salas por tipo: ${tipo}`);
    const salas = await listarSalas();
    const resultados = salas.filter(sala => 
      sala.tipo.toLowerCase() === tipo.toLowerCase()
    );
    console.log("✅ Servicio: Salas filtradas por tipo:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al filtrar salas por tipo:', error);
    throw error;
  }
}

export async function filtrarSalasPorEstado(estado) {
  try {
    console.log(`🔍 Servicio: Filtrando salas por estado: ${estado}`);
    const salas = await listarSalas();
    const resultados = salas.filter(sala => 
      sala.estado.toLowerCase() === estado.toLowerCase()
    );
    console.log("✅ Servicio: Salas filtradas por estado:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al filtrar salas por estado:', error);
    throw error;
  }
}

export async function filtrarSalasPorUbicacion(ubicacion) {
  try {
    console.log(`🔍 Servicio: Filtrando salas por ubicación: ${ubicacion}`);
    const salas = await listarSalas();
    const resultados = salas.filter(sala => 
      sala.ubicacion.toLowerCase().includes(ubicacion.toLowerCase())
    );
    console.log("✅ Servicio: Salas filtradas por ubicación:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al filtrar salas por ubicación:', error);
    throw error;
  }
}

export async function obtenerSalasDisponibles() {
  try {
    console.log("🔍 Servicio: Obteniendo salas disponibles...");
    return await filtrarSalasPorEstado("Disponible");
  } catch (error) {
    console.error('❌ Servicio: Error al obtener salas disponibles:', error);
    throw error;
  }
}

export async function obtenerSalasOcupadas() {
  try {
    console.log("🔍 Servicio: Obteniendo salas ocupadas...");
    return await filtrarSalasPorEstado("Ocupada");
  } catch (error) {
    console.error('❌ Servicio: Error al obtener salas ocupadas:', error);
    throw error;
  }
}

export async function obtenerSalasEnMantenimiento() {
  try {
    console.log("🔍 Servicio: Obteniendo salas en mantenimiento...");
    return await filtrarSalasPorEstado("Mantenimiento");
  } catch (error) {
    console.error('❌ Servicio: Error al obtener salas en mantenimiento:', error);
    throw error;
  }
}

export async function verificarSalaExistente(nombre) {
  try {
    console.log(`🔍 Servicio: Verificando existencia de sala: ${nombre}`);
    const salas = await listarSalas();
    const existe = salas.some(sala => 
      sala.nombre.toLowerCase() === nombre.toLowerCase()
    );
    console.log(`✅ Servicio: Sala "${nombre}" existe:`, existe);
    return existe;
  } catch (error) {
    console.error('❌ Servicio: Error al verificar existencia de sala:', error);
    throw error;
  }
}

export async function obtenerTiposSalaDisponibles() {
  try {
    console.log("🔍 Servicio: Obteniendo tipos de sala únicos...");
    const salas = await listarSalas();
    const tiposSala = [...new Set(salas.map(sala => sala.tipo))];
    console.log("✅ Servicio: Tipos de sala disponibles:", tiposSala);
    return tiposSala;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener tipos de sala:', error);
    throw error;
  }
}

export async function obtenerEstadosSalaDisponibles() {
  try {
    console.log("🔍 Servicio: Obteniendo estados de sala únicos...");
    const salas = await listarSalas();
    const estadosSala = [...new Set(salas.map(sala => sala.estado))];
    console.log("✅ Servicio: Estados de sala disponibles:", estadosSala);
    return estadosSala;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener estados de sala:', error);
    throw error;
  }
}

// Funciones específicas para la gestión de salas en fisioterapia
export async function obtenerSalasParaTipoServicio(tipoServicioNecesario) {
  try {
    console.log(`🔍 Servicio: Obteniendo salas compatibles con tipo de servicio: ${tipoServicioNecesario}`);
    const salas = await listarSalas();
    const salasCompatibles = salas.filter(sala => 
      sala.tipo.toLowerCase().includes(tipoServicioNecesario.toLowerCase())
    );
    console.log("✅ Servicio: Salas compatibles encontradas:", salasCompatibles);
    return salasCompatibles;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener salas para tipo de servicio:', error);
    throw error;
  }
}

export async function obtenerSalasConCapacidadMinima(capacidadMinima) {
  try {
    console.log(`🔍 Servicio: Obteniendo salas con capacidad mínima de ${capacidadMinima}...`);
    const salas = await listarSalas();
    const resultados = salas.filter(sala => 
      sala.capacidad >= capacidadMinima
    );
    console.log("✅ Servicio: Salas con capacidad suficiente:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener salas con capacidad mínima:', error);
    throw error;
  }
}