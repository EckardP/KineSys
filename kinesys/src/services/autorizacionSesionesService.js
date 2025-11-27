import autorizacionSesionesApi from "../api/autorizacionSesionesApi";

export async function listarAutorizaciones() {
  try {
    console.log("🔄 Servicio: Listando autorizaciones de sesiones...");
    const autorizaciones = await autorizacionSesionesApi.getAll();
    console.log("✅ Servicio: Autorizaciones obtenidas:", autorizaciones);
    return autorizaciones;
  } catch (error) {
    console.error('❌ Servicio: Error al listar autorizaciones:', error);
    throw error;
  }
}

export async function obtenerAutorizacion(id) {
  try {
    console.log(`🔄 Servicio: Obteniendo autorización ${id}...`);
    const autorizacion = await autorizacionSesionesApi.getById(id);
    console.log("✅ Servicio: Autorización obtenida:", autorizacion);
    return autorizacion;
  } catch (error) {
    console.error(`❌ Servicio: Error al obtener autorización ${id}:`, error);
    throw error;
  }
}

export async function crearAutorizacion(data) {
  try {
    console.log("🔄 Servicio: Creando autorización con datos:", data);
    
    const datosCompletos = {
      idAutorizacion: 0, // El backend lo asignará automáticamente
      idPaciente: data.idPaciente || 0,
      idOrdenMedica: data.idOrdenMedica || null,
      numeroAutorizacion: data.numeroAutorizacion || "",
      fechaAutorizacion: data.fechaAutorizacion || new Date().toISOString(),
      fechaVigenciaInicio: data.fechaVigenciaInicio || new Date().toISOString(),
      fechaVigenciaFin: data.fechaVigenciaFin || new Date().toISOString(),
      sesionesAprobadas: data.sesionesAprobadas || 0,
      sesionesConsumidas: data.sesionesConsumidas || 0,
      estado: data.estado || "Activa",
      rutaSoporte: data.rutaSoporte || "",
      observaciones: data.observaciones || ""
    };

    // Validaciones básicas
    if (!datosCompletos.idPaciente || datosCompletos.idPaciente === 0) {
      throw new Error('El ID del paciente es requerido');
    }

    if (!datosCompletos.numeroAutorizacion.trim()) {
      throw new Error('El número de autorización es requerido');
    }

    if (datosCompletos.sesionesAprobadas <= 0) {
      throw new Error('El número de sesiones aprobadas debe ser mayor a 0');
    }

    const resultado = await autorizacionSesionesApi.create('', datosCompletos);
    console.log("✅ Servicio: Autorización creada exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Servicio: Error al crear autorización:', error);
    
    // Manejo específico de errores
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('Ya existe una autorización con ese número');
    }
    
    throw error;
  }
}

export async function actualizarAutorizacion(id, data) {
  try {
    console.log(`🔄 Servicio: Actualizando autorización ${id} con datos:`, data);
    
    const datosActualizacion = {
      idAutorizacion: id,
      idPaciente: data.idPaciente || 0,
      idOrdenMedica: data.idOrdenMedica || null,
      numeroAutorizacion: data.numeroAutorizacion || "",
      fechaAutorizacion: data.fechaAutorizacion || new Date().toISOString(),
      fechaVigenciaInicio: data.fechaVigenciaInicio || new Date().toISOString(),
      fechaVigenciaFin: data.fechaVigenciaFin || new Date().toISOString(),
      sesionesAprobadas: data.sesionesAprobadas || 0,
      sesionesConsumidas: data.sesionesConsumidas || 0,
      estado: data.estado || "Activa",
      rutaSoporte: data.rutaSoporte || "",
      observaciones: data.observaciones || ""
    };

    // Validaciones básicas
    if (!datosActualizacion.idPaciente || datosActualizacion.idPaciente === 0) {
      throw new Error('El ID del paciente es requerido');
    }

    if (!datosActualizacion.numeroAutorizacion.trim()) {
      throw new Error('El número de autorización es requerido');
    }

    if (datosActualizacion.sesionesAprobadas <= 0) {
      throw new Error('El número de sesiones aprobadas debe ser mayor a 0');
    }
    
    const resultado = await autorizacionSesionesApi.update(`/${id}`, datosActualizacion);
    console.log("✅ Servicio: Autorización actualizada exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al actualizar autorización ${id}:`, error);
    throw error;
  }
}

export async function eliminarAutorizacion(id) {
  try {
    console.log(`🔄 Servicio: Eliminando autorización ${id}...`);
    const resultado = await autorizacionSesionesApi.delete(id);
    console.log("✅ Servicio: Autorización eliminada exitosamente");
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al eliminar autorización ${id}:`, error);
    
    // Manejo específico para cuando no se puede eliminar por relaciones
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('No se puede eliminar la autorización porque está asociada a citas');
    }
    
    throw error;
  }
}

// Funciones adicionales útiles para autorizaciones
export async function buscarAutorizacionesPorPaciente(idPaciente) {
  try {
    console.log(`🔍 Servicio: Buscando autorizaciones por paciente: ${idPaciente}`);
    const autorizaciones = await listarAutorizaciones();
    const resultados = autorizaciones.filter(autorizacion => 
      autorizacion.idPaciente === idPaciente
    );
    console.log("✅ Servicio: Autorizaciones del paciente:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al buscar autorizaciones por paciente:', error);
    throw error;
  }
}

export async function buscarAutorizacionesPorNumero(numeroAutorizacion) {
  try {
    console.log(`🔍 Servicio: Buscando autorizaciones por número: ${numeroAutorizacion}`);
    const autorizaciones = await listarAutorizaciones();
    const resultados = autorizaciones.filter(autorizacion => 
      autorizacion.numeroAutorizacion.toLowerCase().includes(numeroAutorizacion.toLowerCase())
    );
    console.log("✅ Servicio: Autorizaciones encontradas:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al buscar autorizaciones por número:', error);
    throw error;
  }
}

export async function filtrarAutorizacionesPorEstado(estado) {
  try {
    console.log(`🔍 Servicio: Filtrando autorizaciones por estado: ${estado}`);
    const autorizaciones = await listarAutorizaciones();
    const resultados = autorizaciones.filter(autorizacion => 
      autorizacion.estado.toLowerCase() === estado.toLowerCase()
    );
    console.log("✅ Servicio: Autorizaciones filtradas por estado:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al filtrar autorizaciones por estado:', error);
    throw error;
  }
}

export async function obtenerAutorizacionesActivas() {
  try {
    console.log("🔍 Servicio: Obteniendo autorizaciones activas...");
    return await filtrarAutorizacionesPorEstado("Activa");
  } catch (error) {
    console.error('❌ Servicio: Error al obtener autorizaciones activas:', error);
    throw error;
  }
}

export async function obtenerAutorizacionesVencidas() {
  try {
    console.log("🔍 Servicio: Obteniendo autorizaciones vencidas...");
    return await filtrarAutorizacionesPorEstado("Vencida");
  } catch (error) {
    console.error('❌ Servicio: Error al obtener autorizaciones vencidas:', error);
    throw error;
  }
}

export async function obtenerAutorizacionesUtilizadas() {
  try {
    console.log("🔍 Servicio: Obteniendo autorizaciones utilizadas...");
    return await filtrarAutorizacionesPorEstado("Utilizada");
  } catch (error) {
    console.error('❌ Servicio: Error al obtener autorizaciones utilizadas:', error);
    throw error;
  }
}

export async function obtenerAutorizacionesConSesionesDisponibles() {
  try {
    console.log("🔍 Servicio: Obteniendo autorizaciones con sesiones disponibles...");
    const autorizacionesActivas = await obtenerAutorizacionesActivas();
    const resultados = autorizacionesActivas.filter(autorizacion => {
      const sesionesAprobadas = autorizacion.sesionesAprobadas || 0;
      const sesionesConsumidas = autorizacion.sesionesConsumidas || 0;
      return sesionesAprobadas > sesionesConsumidas;
    });
    console.log("✅ Servicio: Autorizaciones con sesiones disponibles:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener autorizaciones con sesiones disponibles:', error);
    throw error;
  }
}

export async function incrementarSesionesConsumidas(id, cantidad = 1) {
  try {
    console.log(`🔄 Servicio: Incrementando sesiones consumidas en ${cantidad} para autorización ${id}...`);
    
    // Primero obtener la autorización actual
    const autorizacion = await obtenerAutorizacion(id);
    
    const nuevasSesionesConsumidas = (autorizacion.sesionesConsumidas || 0) + cantidad;
    
    // Verificar si se excede el número de sesiones aprobadas
    const sesionesAprobadas = autorizacion.sesionesAprobadas;
    if (nuevasSesionesConsumidas > sesionesAprobadas) {
      throw new Error('No se pueden consumir más sesiones de las aprobadas');
    }
    
    // Actualizar las sesiones consumidas
    const datosActualizacion = {
      ...autorizacion,
      sesionesConsumidas: nuevasSesionesConsumidas
    };
    
    // Si se consumieron todas las sesiones, marcar como utilizada
    if (nuevasSesionesConsumidas >= sesionesAprobadas) {
      datosActualizacion.estado = "Utilizada";
    }
    
    return await actualizarAutorizacion(id, datosActualizacion);
  } catch (error) {
    console.error(`❌ Servicio: Error al incrementar sesiones consumidas:`, error);
    throw error;
  }
}

export async function verificarVencimientoAutorizaciones() {
  try {
    console.log("🔍 Servicio: Verificando vencimiento de autorizaciones...");
    const autorizacionesActivas = await obtenerAutorizacionesActivas();
    const hoy = new Date();
    
    const autorizacionesVencidas = autorizacionesActivas.filter(autorizacion => {
      const fechaVigenciaFin = new Date(autorizacion.fechaVigenciaFin);
      return fechaVigenciaFin < hoy;
    });
    
    // Actualizar estado de autorizaciones vencidas
    for (const autorizacion of autorizacionesVencidas) {
      try {
        const datosActualizacion = {
          ...autorizacion,
          estado: "Vencida"
        };
        await actualizarAutorizacion(autorizacion.idAutorizacion, datosActualizacion);
        console.log(`✅ Autorización ${autorizacion.idAutorizacion} marcada como vencida`);
      } catch (error) {
        console.error(`❌ Error al actualizar autorización ${autorizacion.idAutorizacion}:`, error);
      }
    }
    
    console.log("✅ Servicio: Verificación de vencimientos completada");
    return autorizacionesVencidas;
  } catch (error) {
    console.error('❌ Servicio: Error al verificar vencimiento de autorizaciones:', error);
    throw error;
  }
}

export async function verificarAutorizacionExistente(numeroAutorizacion) {
  try {
    console.log(`🔍 Servicio: Verificando existencia de autorización: ${numeroAutorizacion}`);
    const autorizaciones = await listarAutorizaciones();
    const existe = autorizaciones.some(autorizacion => 
      autorizacion.numeroAutorizacion.toLowerCase() === numeroAutorizacion.toLowerCase()
    );
    console.log(`✅ Servicio: Autorización "${numeroAutorizacion}" existe:`, existe);
    return existe;
  } catch (error) {
    console.error('❌ Servicio: Error al verificar existencia de autorización:', error);
    throw error;
  }
}

export async function obtenerResumenAutorizacionesPorPaciente(idPaciente) {
  try {
    console.log(`📊 Servicio: Obteniendo resumen de autorizaciones para paciente ${idPaciente}...`);
    const autorizacionesPaciente = await buscarAutorizacionesPorPaciente(idPaciente);
    
    const resumen = {
      total: autorizacionesPaciente.length,
      activas: autorizacionesPaciente.filter(a => a.estado === "Activa").length,
      vencidas: autorizacionesPaciente.filter(a => a.estado === "Vencida").length,
      utilizadas: autorizacionesPaciente.filter(a => a.estado === "Utilizada").length,
      sesionesTotalesAprobadas: autorizacionesPaciente.reduce((sum, autorizacion) => sum + (autorizacion.sesionesAprobadas || 0), 0),
      sesionesTotalesConsumidas: autorizacionesPaciente.reduce((sum, autorizacion) => sum + (autorizacion.sesionesConsumidas || 0), 0),
      sesionesDisponibles: autorizacionesPaciente.reduce((sum, autorizacion) => {
        const aprobadas = autorizacion.sesionesAprobadas || 0;
        const consumidas = autorizacion.sesionesConsumidas || 0;
        return sum + (aprobadas - consumidas);
      }, 0)
    };
    
    console.log("✅ Servicio: Resumen de autorizaciones del paciente:", resumen);
    return resumen;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener resumen de autorizaciones por paciente:', error);
    throw error;
  }
}

export async function obtenerAutorizacionesPorRangoDeFechas(fechaInicio, fechaFin) {
  try {
    console.log(`🔍 Servicio: Obteniendo autorizaciones entre ${fechaInicio} y ${fechaFin}...`);
    const autorizaciones = await listarAutorizaciones();
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
    
    const resultados = autorizaciones.filter(autorizacion => {
      const fechaAutorizacion = new Date(autorizacion.fechaAutorizacion);
      return fechaAutorizacion >= fechaInicioDate && fechaAutorizacion <= fechaFinDate;
    });
    
    console.log("✅ Servicio: Autorizaciones en el rango de fechas:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener autorizaciones por rango de fechas:', error);
    throw error;
  }
}

export async function obtenerAutorizacionesProximasAVencer(diasAntes = 7) {
  try {
    console.log(`🔍 Servicio: Obteniendo autorizaciones próximas a vencer (${diasAntes} días)...`);
    const autorizacionesActivas = await obtenerAutorizacionesActivas();
    const hoy = new Date();
    const fechaLimite = new Date(hoy.getTime() + diasAntes * 24 * 60 * 60 * 1000);
    
    const resultados = autorizacionesActivas.filter(autorizacion => {
      const fechaVigenciaFin = new Date(autorizacion.fechaVigenciaFin);
      return fechaVigenciaFin <= fechaLimite && fechaVigenciaFin >= hoy;
    });
    
    console.log("✅ Servicio: Autorizaciones próximas a vencer:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener autorizaciones próximas a vencer:', error);
    throw error;
  }
}

export async function validarAutorizacionParaCita(idAutorizacion) {
  try {
    console.log(`🔍 Servicio: Validando autorización ${idAutorizacion} para cita...`);
    const autorizacion = await obtenerAutorizacion(idAutorizacion);
    
    const validaciones = {
      estaActiva: autorizacion.estado === "Activa",
      tieneSesionesDisponibles: (autorizacion.sesionesAprobadas - autorizacion.sesionesConsumidas) > 0,
      estaEnVigencia: new Date() >= new Date(autorizacion.fechaVigenciaInicio) && 
                      new Date() <= new Date(autorizacion.fechaVigenciaFin)
    };
    
    const esValida = validaciones.estaActiva && 
                    validaciones.tieneSesionesDisponibles && 
                    validaciones.estaEnVigencia;
    
    console.log("✅ Servicio: Validación de autorización:", { esValida, validaciones });
    return { esValida, validaciones, autorizacion };
  } catch (error) {
    console.error('❌ Servicio: Error al validar autorización:', error);
    throw error;
  }
}

export async function obtenerAutorizacionesPorOrdenMedica(idOrdenMedica) {
  try {
    console.log(`🔍 Servicio: Obteniendo autorizaciones por orden médica: ${idOrdenMedica}`);
    const autorizaciones = await listarAutorizaciones();
    const resultados = autorizaciones.filter(autorizacion => 
      autorizacion.idOrdenMedica === idOrdenMedica
    );
    console.log("✅ Servicio: Autorizaciones de la orden médica:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener autorizaciones por orden médica:', error);
    throw error;
  }
}