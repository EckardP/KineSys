import citasApi from "../api/citasApi";

export async function listarCitas() {
  try {
    console.log("🔄 Servicio: Listando citas...");
    const citas = await citasApi.getAll();
    console.log("✅ Servicio: Citas obtenidas:", citas);
    return citas;
  } catch (error) {
    console.error('❌ Servicio: Error al listar citas:', error);
    throw error;
  }
}

export async function obtenerCita(id) {
  try {
    console.log(`🔄 Servicio: Obteniendo cita ${id}...`);
    const cita = await citasApi.getById(id);
    console.log("✅ Servicio: Cita obtenida:", cita);
    return cita;
  } catch (error) {
    console.error(`❌ Servicio: Error al obtener cita ${id}:`, error);
    throw error;
  }
}

export async function crearCita(data) {
  try {
    console.log("🔄 Servicio: Creando cita con datos:", data);
    
    const datosCompletos = {
      idCita: 0, // El backend lo asignará automáticamente
      duracionProgramadaMin: data.duracionProgramadaMin || 30,
      horaInicioReal: data.horaInicioReal || null,
      horaFinReal: data.horaFinReal || null,
      checkIn: data.checkIn || null,
      checkOut: data.checkOut || null,
      confirmada: data.confirmada !== undefined ? data.confirmada : false,
      motivo: data.motivo || "",
      estado: data.estado || "Programada",
      precioCita: data.precioCita || 0,
      tipoAtencion: data.tipoAtencion || "Particular",
      idEPS: data.idEPS || null,
      copago: data.copago || 0,
      idAutorizacion: data.idAutorizacion || null,
      idOrdenMedica: data.idOrdenMedica || null,
      idSala: data.idSala || null,
      idTipoServicio: data.idTipoServicio || null,
      idPaciente: data.idPaciente || 0,
      idTerapeuta: data.idTerapeuta || 0,
      idTratamiento: data.idTratamiento || null
    };

    // Validaciones básicas
    if (!datosCompletos.idPaciente || datosCompletos.idPaciente === 0) {
      throw new Error('El ID del paciente es requerido');
    }

    if (!datosCompletos.idTerapeuta || datosCompletos.idTerapeuta === 0) {
      throw new Error('El ID del terapeuta es requerido');
    }

    if (datosCompletos.duracionProgramadaMin <= 0) {
      throw new Error('La duración programada debe ser mayor a 0');
    }

    const resultado = await citasApi.create('', datosCompletos);
    console.log("✅ Servicio: Cita creada exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Servicio: Error al crear cita:', error);
    
    // Manejo específico de errores
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('Ya existe una cita en ese horario');
    }
    
    throw error;
  }
}

export async function actualizarCita(id, data) {
  try {
    console.log(`🔄 Servicio: Actualizando cita ${id} con datos:`, data);
    
    const datosActualizacion = {
      idCita: id,
      duracionProgramadaMin: data.duracionProgramadaMin || 30,
      horaInicioReal: data.horaInicioReal || null,
      horaFinReal: data.horaFinReal || null,
      checkIn: data.checkIn || null,
      checkOut: data.checkOut || null,
      confirmada: data.confirmada !== undefined ? data.confirmada : false,
      motivo: data.motivo || "",
      estado: data.estado || "Programada",
      precioCita: data.precioCita || 0,
      tipoAtencion: data.tipoAtencion || "Particular",
      idEPS: data.idEPS || null,
      copago: data.copago || 0,
      idAutorizacion: data.idAutorizacion || null,
      idOrdenMedica: data.idOrdenMedica || null,
      idSala: data.idSala || null,
      idTipoServicio: data.idTipoServicio || null,
      idPaciente: data.idPaciente || 0,
      idTerapeuta: data.idTerapeuta || 0,
      idTratamiento: data.idTratamiento || null
    };

    // Validaciones básicas
    if (!datosActualizacion.idPaciente || datosActualizacion.idPaciente === 0) {
      throw new Error('El ID del paciente es requerido');
    }

    if (!datosActualizacion.idTerapeuta || datosActualizacion.idTerapeuta === 0) {
      throw new Error('El ID del terapeuta es requerido');
    }

    if (datosActualizacion.duracionProgramadaMin <= 0) {
      throw new Error('La duración programada debe ser mayor a 0');
    }
    
    const resultado = await citasApi.update(`/${id}`, datosActualizacion);
    console.log("✅ Servicio: Cita actualizada exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al actualizar cita ${id}:`, error);
    throw error;
  }
}

export async function eliminarCita(id) {
  try {
    console.log(`🔄 Servicio: Eliminando cita ${id}...`);
    const resultado = await citasApi.delete(id);
    console.log("✅ Servicio: Cita eliminada exitosamente");
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al eliminar cita ${id}:`, error);
    
    // Manejo específico para cuando no se puede eliminar por relaciones
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('No se puede eliminar la cita porque tiene registros asociados');
    }
    
    throw error;
  }
}

// Funciones adicionales útiles para citas
export async function buscarCitasPorPaciente(idPaciente) {
  try {
    console.log(`🔍 Servicio: Buscando citas por paciente: ${idPaciente}`);
    const citas = await listarCitas();
    const resultados = citas.filter(cita => 
      cita.idPaciente === idPaciente
    );
    console.log("✅ Servicio: Citas del paciente:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al buscar citas por paciente:', error);
    throw error;
  }
}

export async function buscarCitasPorTerapeuta(idTerapeuta) {
  try {
    console.log(`🔍 Servicio: Buscando citas por terapeuta: ${idTerapeuta}`);
    const citas = await listarCitas();
    const resultados = citas.filter(cita => 
      cita.idTerapeuta === idTerapeuta
    );
    console.log("✅ Servicio: Citas del terapeuta:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al buscar citas por terapeuta:', error);
    throw error;
  }
}

export async function filtrarCitasPorEstado(estado) {
  try {
    console.log(`🔍 Servicio: Filtrando citas por estado: ${estado}`);
    const citas = await listarCitas();
    const resultados = citas.filter(cita => 
      cita.estado.toLowerCase() === estado.toLowerCase()
    );
    console.log("✅ Servicio: Citas filtradas por estado:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al filtrar citas por estado:', error);
    throw error;
  }
}

export async function filtrarCitasPorTipoAtencion(tipoAtencion) {
  try {
    console.log(`🔍 Servicio: Filtrando citas por tipo de atención: ${tipoAtencion}`);
    const citas = await listarCitas();
    const resultados = citas.filter(cita => 
      cita.tipoAtencion.toLowerCase() === tipoAtencion.toLowerCase()
    );
    console.log("✅ Servicio: Citas filtradas por tipo de atención:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al filtrar citas por tipo de atención:', error);
    throw error;
  }
}

export async function obtenerCitasProgramadas() {
  try {
    console.log("🔍 Servicio: Obteniendo citas programadas...");
    return await filtrarCitasPorEstado("Programada");
  } catch (error) {
    console.error('❌ Servicio: Error al obtener citas programadas:', error);
    throw error;
  }
}

export async function obtenerCitasConfirmadas() {
  try {
    console.log("🔍 Servicio: Obteniendo citas confirmadas...");
    return await filtrarCitasPorEstado("Confirmada");
  } catch (error) {
    console.error('❌ Servicio: Error al obtener citas confirmadas:', error);
    throw error;
  }
}

export async function obtenerCitasCompletadas() {
  try {
    console.log("🔍 Servicio: Obteniendo citas completadas...");
    return await filtrarCitasPorEstado("Completada");
  } catch (error) {
    console.error('❌ Servicio: Error al obtener citas completadas:', error);
    throw error;
  }
}

export async function obtenerCitasCanceladas() {
  try {
    console.log("🔍 Servicio: Obteniendo citas canceladas...");
    return await filtrarCitasPorEstado("Cancelada");
  } catch (error) {
    console.error('❌ Servicio: Error al obtener citas canceladas:', error);
    throw error;
  }
}

export async function confirmarCita(id) {
  try {
    console.log(`🔄 Servicio: Confirmando cita ${id}...`);
    
    // Primero obtener la cita actual
    const cita = await obtenerCita(id);
    
    // Actualizar solo el estado a Confirmada y marcar como confirmada
    const datosActualizacion = {
      ...cita,
      estado: "Confirmada",
      confirmada: true
    };
    
    return await actualizarCita(id, datosActualizacion);
  } catch (error) {
    console.error(`❌ Servicio: Error al confirmar cita:`, error);
    throw error;
  }
}

export async function cancelarCita(id) {
  try {
    console.log(`🔄 Servicio: Cancelando cita ${id}...`);
    
    // Primero obtener la cita actual
    const cita = await obtenerCita(id);
    
    // Actualizar solo el estado a Cancelada
    const datosActualizacion = {
      ...cita,
      estado: "Cancelada",
      confirmada: false
    };
    
    return await actualizarCita(id, datosActualizacion);
  } catch (error) {
    console.error(`❌ Servicio: Error al cancelar cita:`, error);
    throw error;
  }
}

export async function realizarCheckIn(id) {
  try {
    console.log(`🔄 Servicio: Realizando check-in para cita ${id}...`);
    
    // Primero obtener la cita actual
    const cita = await obtenerCita(id);
    
    // Actualizar el check-in con la fecha y hora actual
    const datosActualizacion = {
      ...cita,
      checkIn: new Date().toISOString()
    };
    
    return await actualizarCita(id, datosActualizacion);
  } catch (error) {
    console.error(`❌ Servicio: Error al realizar check-in:`, error);
    throw error;
  }
}

export async function realizarCheckOut(id) {
  try {
    console.log(`🔄 Servicio: Realizando check-out para cita ${id}...`);
    
    // Primero obtener la cita actual
    const cita = await obtenerCita(id);
    
    // Actualizar el check-out con la fecha y hora actual
    const datosActualizacion = {
      ...cita,
      checkOut: new Date().toISOString(),
      estado: "Completada"
    };
    
    return await actualizarCita(id, datosActualizacion);
  } catch (error) {
    console.error(`❌ Servicio: Error al realizar check-out:`, error);
    throw error;
  }
}

export async function iniciarCita(id) {
  try {
    console.log(`🔄 Servicio: Iniciando cita ${id}...`);
    
    // Primero obtener la cita actual
    const cita = await obtenerCita(id);
    
    // Actualizar la hora de inicio real con la fecha y hora actual
    const datosActualizacion = {
      ...cita,
      horaInicioReal: new Date().toISOString(),
      estado: "En Progreso"
    };
    
    return await actualizarCita(id, datosActualizacion);
  } catch (error) {
    console.error(`❌ Servicio: Error al iniciar cita:`, error);
    throw error;
  }
}

export async function finalizarCita(id) {
  try {
    console.log(`🔄 Servicio: Finalizando cita ${id}...`);
    
    // Primero obtener la cita actual
    const cita = await obtenerCita(id);
    
    // Actualizar la hora de fin real con la fecha y hora actual
    const datosActualizacion = {
      ...cita,
      horaFinReal: new Date().toISOString(),
      estado: "Completada"
    };
    
    return await actualizarCita(id, datosActualizacion);
  } catch (error) {
    console.error(`❌ Servicio: Error al finalizar cita:`, error);
    throw error;
  }
}

export async function verificarDisponibilidad(idTerapeuta, fechaHoraInicio, duracionMin) {
  try {
    console.log(`🔍 Servicio: Verificando disponibilidad para terapeuta ${idTerapeuta} en ${fechaHoraInicio} por ${duracionMin} minutos...`);
    
    // Obtener todas las citas del terapeuta
    const citasTerapeuta = await buscarCitasPorTerapeuta(idTerapeuta);
    
    // Convertir la fecha de inicio a Date
    const inicioPropuesto = new Date(fechaHoraInicio);
    const finPropuesto = new Date(inicioPropuesto.getTime() + duracionMin * 60000);
    
    // Verificar superposición con citas existentes
    const tieneConflicto = citasTerapeuta.some(cita => {
      // Solo verificar citas que no estén canceladas
      if (cita.estado === "Cancelada") return false;
      
      const inicioExistente = new Date(cita.horaInicioReal || cita.horaInicioProgramada); // Asumiendo que hay una hora de inicio programada
      const finExistente = new Date(inicioExistente.getTime() + cita.duracionProgramadaMin * 60000);
      
      // Verificar superposición
      return (
        (inicioPropuesto >= inicioExistente && inicioPropuesto < finExistente) ||
        (finPropuesto > inicioExistente && finPropuesto <= finExistente) ||
        (inicioPropuesto <= inicioExistente && finPropuesto >= finExistente)
      );
    });
    
    const disponible = !tieneConflicto;
    console.log(`✅ Servicio: Disponibilidad verificada:`, disponible);
    return disponible;
  } catch (error) {
    console.error('❌ Servicio: Error al verificar disponibilidad:', error);
    throw error;
  }
}

export async function obtenerCitasPorRangoDeFechas(fechaInicio, fechaFin) {
  try {
    console.log(`🔍 Servicio: Obteniendo citas entre ${fechaInicio} y ${fechaFin}...`);
    const citas = await listarCitas();
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
    
    const resultados = citas.filter(cita => {
      // Usar la hora de inicio real o programada (depende de tu modelo)
      const fechaCita = new Date(cita.horaInicioReal || cita.horaInicioProgramada);
      return fechaCita >= fechaInicioDate && fechaCita <= fechaFinDate;
    });
    
    console.log("✅ Servicio: Citas en el rango de fechas:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener citas por rango de fechas:', error);
    throw error;
  }
}

export async function obtenerCitasHoy() {
  try {
    console.log("🔍 Servicio: Obteniendo citas de hoy...");
    const hoy = new Date();
    const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
    
    return await obtenerCitasPorRangoDeFechas(inicioDia, finDia);
  } catch (error) {
    console.error('❌ Servicio: Error al obtener citas de hoy:', error);
    throw error;
  }
}

export async function obtenerCitasProximaSemana() {
  try {
    console.log("🔍 Servicio: Obteniendo citas de la próxima semana...");
    const hoy = new Date();
    const inicioSemana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finSemana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 7);
    
    return await obtenerCitasPorRangoDeFechas(inicioSemana, finSemana);
  } catch (error) {
    console.error('❌ Servicio: Error al obtener citas de la próxima semana:', error);
    throw error;
  }
}

export async function obtenerResumenCitas() {
  try {
    console.log("📊 Servicio: Obteniendo resumen de citas...");
    const citas = await listarCitas();
    
    const resumen = {
      total: citas.length,
      programadas: citas.filter(c => c.estado === "Programada").length,
      confirmadas: citas.filter(c => c.estado === "Confirmada").length,
      enProgreso: citas.filter(c => c.estado === "En Progreso").length,
      completadas: citas.filter(c => c.estado === "Completada").length,
      canceladas: citas.filter(c => c.estado === "Cancelada").length,
      ingresosTotales: citas.reduce((sum, cita) => sum + (cita.precioCita || 0), 0)
    };
    
    console.log("✅ Servicio: Resumen de citas:", resumen);
    return resumen;
  } catch (error) {
    console.error('❌ Servicio: Error al obtener resumen de citas:', error);
    throw error;
  }
}