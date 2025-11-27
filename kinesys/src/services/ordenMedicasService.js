import ordenMedicasApi from "../api/ordenMedicasApi";

export async function listarOrdenesMedicas() {
  try {
    console.log("🔄 Servicio: Listando órdenes médicas...");
    const ordenesMedicas = await ordenMedicasApi.getAll();
    console.log("✅ Servicio: Órdenes médicas obtenidas:", ordenesMedicas);
    return ordenesMedicas;
  } catch (error) {
    console.error('❌ Servicio: Error al listar órdenes médicas:', error);
    throw error;
  }
}

export async function obtenerOrdenMedica(id) {
  try {
    console.log(`🔄 Servicio: Obteniendo orden médica ${id}...`);
    const ordenMedica = await ordenMedicasApi.getById(id);
    console.log("✅ Servicio: Orden médica obtenida:", ordenMedica);
    return ordenMedica;
  } catch (error) {
    console.error(`❌ Servicio: Error al obtener orden médica ${id}:`, error);
    throw error;
  }
}

export async function crearOrdenMedica(data) {
  try {
    console.log("🔄 Servicio: Creando orden médica con datos:", data);
    
    const datosCompletos = {
      idOrdenMedica: 0, // El backend lo asignará automáticamente
      idPaciente: data.idPaciente || 0,
      idTipoDocumento: data.idTipoDocumento || null,
      numeroOrden: data.numeroOrden || "",
      fechaEmision: data.fechaEmision || new Date().toISOString(),
      fechaVencimiento: data.fechaVencimiento || null,
      medicoEmite: data.medicoEmite || "",
      especialidad: data.especialidad || "",
      diagnostico: data.diagnostico || "",
      tratamientoOrdenado: data.tratamientoOrdenado || "",
      numeroSesionesAutorizadas: data.numeroSesionesAutorizadas || null,
      sesionesConsumidas: data.sesionesConsumidas || 0,
      estado: data.estado || "Activa",
      rutaSoporte: data.rutaSoporte || "",
      observaciones: data.observaciones || ""
    };

    // Validaciones básicas
    if (!datosCompletos.idPaciente || datosCompletos.idPaciente === 0) {
      throw new Error('El ID del paciente es requerido');
    }

    if (!datosCompletos.numeroOrden.trim()) {
      throw new Error('El número de orden es requerido');
    }

    if (!datosCompletos.medicoEmite.trim()) {
      throw new Error('El médico que emite es requerido');
    }

    if (!datosCompletos.tratamientoOrdenado.trim()) {
      throw new Error('El tratamiento ordenado es requerido');
    }

    const resultado = await ordenMedicasApi.create('', datosCompletos);
    console.log("✅ Servicio: Orden médica creada exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Servicio: Error al crear orden médica:', error);
    
    // Manejo específico de errores
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('Ya existe una orden médica con ese número');
    }
    
    throw error;
  }
}

export async function actualizarOrdenMedica(id, data) {
  try {
    console.log(`🔄 Servicio: Actualizando orden médica ${id} con datos:`, data);
    
    const datosActualizacion = {
      idOrdenMedica: id,
      idPaciente: data.idPaciente || 0,
      idTipoDocumento: data.idTipoDocumento || null,
      numeroOrden: data.numeroOrden || "",
      fechaEmision: data.fechaEmision || new Date().toISOString(),
      fechaVencimiento: data.fechaVencimiento || null,
      medicoEmite: data.medicoEmite || "",
      especialidad: data.especialidad || "",
      diagnostico: data.diagnostico || "",
      tratamientoOrdenado: data.tratamientoOrdenado || "",
      numeroSesionesAutorizadas: data.numeroSesionesAutorizadas || null,
      sesionesConsumidas: data.sesionesConsumidas || 0,
      estado: data.estado || "Activa",
      rutaSoporte: data.rutaSoporte || "",
      observaciones: data.observaciones || ""
    };

    // Validaciones básicas
    if (!datosActualizacion.idPaciente || datosActualizacion.idPaciente === 0) {
      throw new Error('El ID del paciente es requerido');
    }

    if (!datosActualizacion.numeroOrden.trim()) {
      throw new Error('El número de orden es requerido');
    }

    if (!datosActualizacion.medicoEmite.trim()) {
      throw new Error('El médico que emite es requerido');
    }

    if (!datosActualizacion.tratamientoOrdenado.trim()) {
      throw new Error('El tratamiento ordenado es requerido');
    }
    
    const resultado = await ordenMedicasApi.update(`/${id}`, datosActualizacion);
    console.log("✅ Servicio: Orden médica actualizada exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al actualizar orden médica ${id}:`, error);
    throw error;
  }
}

export async function eliminarOrdenMedica(id) {
  try {
    console.log(`🔄 Servicio: Eliminando orden médica ${id}...`);
    const resultado = await ordenMedicasApi.delete(id);
    console.log("✅ Servicio: Orden médica eliminada exitosamente");
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al eliminar orden médica ${id}:`, error);
    
    // Manejo específico para cuando no se puede eliminar por relaciones
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('No se puede eliminar la orden médica porque está asociada a citas');
    }
    
    throw error;
  }
}

// Funciones adicionales útiles para órdenes médicas
export async function buscarOrdenesPorPaciente(idPaciente) {
  try {
    console.log(`🔍 Servicio: Buscando órdenes médicas por paciente: ${idPaciente}`);
    const ordenesMedicas = await listarOrdenesMedicas();
    const resultados = ordenesMedicas.filter(orden => 
      orden.idPaciente === idPaciente
    );
    console.log("✅ Servicio: Órdenes médicas del paciente:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al buscar órdenes médicas por paciente:', error);
    throw error;
  }
}

export async function buscarOrdenesPorNumero(numeroOrden) {
  try {
    console.log(`🔍 Servicio: Buscando órdenes médicas por número: ${numeroOrden}`);
    const ordenesMedicas = await listarOrdenesMedicas();
    const resultados = ordenesMedicas.filter(orden => 
      orden.numeroOrden.toLowerCase().includes(numeroOrden.toLowerCase())
    );
    console.log("✅ Servicio: Órdenes médicas encontradas:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al buscar órdenes médicas por número:', error);
    throw error;
  }
}

export async function filtrarOrdenesPorEstado(estado) {
  try {
    console.log(`🔍 Servicio: Filtrando órdenes médicas por estado: ${estado}`);
    const ordenesMedicas = await listarOrdenesMedicas();
    const resultados = ordenesMedicas.filter(orden => 
      orden.estado.toLowerCase() === estado.toLowerCase()
    );
    console.log("✅ Servicio: Órdenes médicas filtradas por estado:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al filtrar órdenes médicas por estado:', error);
    throw error;
  }
}

export async function filtrarOrdenesPorMedico(medicoEmite) {
  try {
    console.log(`🔍 Servicio: Filtrando órdenes médicas por médico: ${medicoEmite}`);
    const ordenesMedicas = await listarOrdenesMedicas();
    const resultados = ordenesMedicas.filter(orden => 
      orden.medicoEmite.toLowerCase().includes(medicoEmite.toLowerCase())
    );
    console.log("✅ Servicio: Órdenes médicas filtradas por médico:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al filtrar órdenes médicas por médico:', error);
    throw error;
  }
}

export async function obtenerOrdenesActivas() {
  try {
    console.log("🔍 Servicio: Obteniendo órdenes médicas activas...");
    return await filtrarOrdenesPorEstado("Activa");
  } catch (error) {
    console.error('❌ Servicio: Error al obtener órdenes médicas activas:', error);
    throw error;
  }
}

export async function obtenerOrdenesVencidas() {
  try {
    console.log("🔍 Servicio: Obteniendo órdenes médicas vencidas...");
    return await filtrarOrdenesPorEstado("Vencida");
  } catch (error) {
    console.error('❌ Servicio: Error al obtener órdenes médicas vencidas:', error);
    throw error;
  }
}

export async function obtenerOrdenesUtilizadas() {
  try {
    console.log("🔍 Servicio: Obteniendo órdenes médicas utilizadas...");
    return await filtrarOrdenesPorEstado("Utilizada");
  } catch (error) {
    console.error('❌ Servicio: Error al obtener órdenes médicas utilizadas:', error);
    throw error;
  }
}

export async function obtenerOrdenesConSesionesDisponibles() {
  try {
    console.log("🔍 Servicio: Obteniendo órdenes médicas con sesiones disponibles...");
    const ordenesActivas = await obtenerOrdenesActivas();
    const resultados = ordenesActivas.filter(orden => {
      const sesionesAutorizadas = orden.numeroSesionesAutorizadas || 0;
      const sesionesConsumidas = orden.sesionesConsumidas || 0;
      return sesionesAutorizadas > sesionesConsumidas;
    });
    console.log("✅ Servicio: Órdenes con sesiones disponibles:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener órdenes con sesiones disponibles:', error);
    throw error;
  }
}

export async function incrementarSesionesConsumidas(id, cantidad = 1) {
  try {
    console.log(`🔄 Servicio: Incrementando sesiones consumidas en ${cantidad} para orden médica ${id}...`);
    
    // Primero obtener la orden médica actual
    const ordenMedica = await obtenerOrdenMedica(id);
    
    const nuevasSesionesConsumidas = (ordenMedica.sesionesConsumidas || 0) + cantidad;
    
    // Verificar si se excede el número de sesiones autorizadas
    const sesionesAutorizadas = ordenMedica.numeroSesionesAutorizadas;
    if (sesionesAutorizadas && nuevasSesionesConsumidas > sesionesAutorizadas) {
      throw new Error('No se pueden consumir más sesiones de las autorizadas');
    }
    
    // Actualizar las sesiones consumidas
    const datosActualizacion = {
      ...ordenMedica,
      sesionesConsumidas: nuevasSesionesConsumidas
    };
    
    // Si se consumieron todas las sesiones, marcar como utilizada
    if (sesionesAutorizadas && nuevasSesionesConsumidas >= sesionesAutorizadas) {
      datosActualizacion.estado = "Utilizada";
    }
    
    return await actualizarOrdenMedica(id, datosActualizacion);
  } catch (error) {
    console.error(`❌ Servicio: Error al incrementar sesiones consumidas:`, error);
    throw error;
  }
}

export async function verificarVencimientoOrdenes() {
  try {
    console.log("🔍 Servicio: Verificando vencimiento de órdenes médicas...");
    const ordenesActivas = await obtenerOrdenesActivas();
    const hoy = new Date();
    
    const ordenesVencidas = ordenesActivas.filter(orden => {
      if (!orden.fechaVencimiento) return false;
      const fechaVencimiento = new Date(orden.fechaVencimiento);
      return fechaVencimiento < hoy;
    });
    
    // Actualizar estado de órdenes vencidas
    for (const orden of ordenesVencidas) {
      try {
        const datosActualizacion = {
          ...orden,
          estado: "Vencida"
        };
        await actualizarOrdenMedica(orden.idOrdenMedica, datosActualizacion);
        console.log(`✅ Orden médica ${orden.idOrdenMedica} marcada como vencida`);
      } catch (error) {
        console.error(`❌ Error al actualizar orden ${orden.idOrdenMedica}:`, error);
      }
    }
    
    console.log("✅ Servicio: Verificación de vencimientos completada");
    return ordenesVencidas;
  } catch (error) {
    console.error('❌ Servicio: Error al verificar vencimiento de órdenes:', error);
    throw error;
  }
}

export async function verificarOrdenExistente(numeroOrden) {
  try {
    console.log(`🔍 Servicio: Verificando existencia de orden médica: ${numeroOrden}`);
    const ordenesMedicas = await listarOrdenesMedicas();
    const existe = ordenesMedicas.some(orden => 
      orden.numeroOrden.toLowerCase() === numeroOrden.toLowerCase()
    );
    console.log(`✅ Servicio: Orden médica "${numeroOrden}" existe:`, existe);
    return existe;
  } catch (error) {
    console.error('❌ Servicio: Error al verificar existencia de orden médica:', error);
    throw error;
  }
}

export async function obtenerResumenOrdenesPorPaciente(idPaciente) {
  try {
    console.log(`📊 Servicio: Obteniendo resumen de órdenes médicas para paciente ${idPaciente}...`);
    const ordenesPaciente = await buscarOrdenesPorPaciente(idPaciente);
    
    const resumen = {
      total: ordenesPaciente.length,
      activas: ordenesPaciente.filter(o => o.estado === "Activa").length,
      vencidas: ordenesPaciente.filter(o => o.estado === "Vencida").length,
      utilizadas: ordenesPaciente.filter(o => o.estado === "Utilizada").length,
      sesionesTotalesAutorizadas: ordenesPaciente.reduce((sum, orden) => sum + (orden.numeroSesionesAutorizadas || 0), 0),
      sesionesTotalesConsumidas: ordenesPaciente.reduce((sum, orden) => sum + (orden.sesionesConsumidas || 0), 0),
      sesionesDisponibles: ordenesPaciente.reduce((sum, orden) => {
        const autorizadas = orden.numeroSesionesAutorizadas || 0;
        const consumidas = orden.sesionesConsumidas || 0;
        return sum + (autorizadas - consumidas);
      }, 0)
    };
    
    console.log("✅ Servicio: Resumen de órdenes del paciente:", resumen);
    return resumen;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener resumen de órdenes por paciente:', error);
    throw error;
  }
}

export async function obtenerOrdenesPorRangoDeFechas(fechaInicio, fechaFin) {
  try {
    console.log(`🔍 Servicio: Obteniendo órdenes médicas entre ${fechaInicio} y ${fechaFin}...`);
    const ordenesMedicas = await listarOrdenesMedicas();
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
    
    const resultados = ordenesMedicas.filter(orden => {
      const fechaEmision = new Date(orden.fechaEmision);
      return fechaEmision >= fechaInicioDate && fechaEmision <= fechaFinDate;
    });
    
    console.log("✅ Servicio: Órdenes en el rango de fechas:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener órdenes por rango de fechas:', error);
    throw error;
  }
}

export async function obtenerOrdenesProximasAVencer(diasAntes = 7) {
  try {
    console.log(`🔍 Servicio: Obteniendo órdenes médicas próximas a vencer (${diasAntes} días)...`);
    const ordenesActivas = await obtenerOrdenesActivas();
    const hoy = new Date();
    const fechaLimite = new Date(hoy.getTime() + diasAntes * 24 * 60 * 60 * 1000);
    
    const resultados = ordenesActivas.filter(orden => {
      if (!orden.fechaVencimiento) return false;
      const fechaVencimiento = new Date(orden.fechaVencimiento);
      return fechaVencimiento <= fechaLimite && fechaVencimiento >= hoy;
    });
    
    console.log("✅ Servicio: Órdenes próximas a vencer:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener órdenes próximas a vencer:', error);
    throw error;
  }
}