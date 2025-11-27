// src/services/citasService.js
import citasApi from "../api/citasApi";
import { actualizarDisponibilidad, liberarDisponibilidad } from "./disponibilidadTerapeutaService";

// 🔥 FUNCIONES BÁSICAS - Agregadas
export async function listarCitas() {
  try {
    return await citasApi.getAll();
  } catch (error) {
    console.error('Error al listar citas:', error);
    throw error;
  }
}

export async function obtenerCita(id) {
  try {
    return await citasApi.getById(id);
  } catch (error) {
    console.error(`Error al obtener cita ${id}:`, error);
    throw error;
  }
}

export async function crearCita(data) {
  try {
    console.log("🔄 Creando cita con datos:", data);
    
    // Extraer idDisponibilidad de los datos (no pertenece al modelo Cita)
    const { idDisponibilidad, ...datosCita } = data;
    
    // 1. Primero crear la cita
    const citaCreada = await citasApi.create('', datosCita);
    console.log("✅ Cita creada:", citaCreada);

    // 2. Si hay idDisponibilidad, actualizar la disponibilidad con el IdCita
    if (citaCreada && citaCreada.idCita && idDisponibilidad) {
      console.log("🔄 Actualizando disponibilidad con ID:", idDisponibilidad);
      
      try {
        await actualizarDisponibilidad(idDisponibilidad, {
          idCita: citaCreada.idCita,
          disponible: false
        });
        console.log("✅ Disponibilidad actualizada correctamente");
        
        // 🔥 OPCIONAL: Si quieres mantener la referencia en el frontend
        citaCreada.idDisponibilidad = idDisponibilidad;
        
      } catch (error) {
        console.error("❌ Error al actualizar disponibilidad:", error);
        // Revertir: eliminar la cita recién creada
        await eliminarCita(citaCreada.idCita);
        throw new Error("Error al reservar el horario. La cita no pudo ser agendada.");
      }
    }

    return citaCreada;
  } catch (error) {
    console.error("❌ Error al crear cita:", error);
    throw error;
  }
}

export async function actualizarCita(id, data) {
  try {
    console.log("🔄 Actualizando cita:", id, "con datos:", data);
    
    // Extraer idDisponibilidad
    const { idDisponibilidad, ...datosCita } = data;
    
    const citaActualizada = await citasApi.update(`/${id}`, datosCita);
    console.log("✅ Cita actualizada:", citaActualizada);

    // Actualizar disponibilidad si se proporcionó
    if (citaActualizada && idDisponibilidad) {
      console.log("🔄 Actualizando disponibilidad con ID:", idDisponibilidad);
      
      try {
        await actualizarDisponibilidad(idDisponibilidad, {
          idCita: citaActualizada.idCita,
          disponible: false
        });
        console.log("✅ Disponibilidad actualizada correctamente");
      } catch (error) {
        console.error("❌ Error al actualizar disponibilidad:", error);
        throw new Error("Cita actualizada pero error al reservar el horario.");
      }
    }

    return citaActualizada;
  } catch (error) {
    console.error(`Error al actualizar cita ${id}:`, error);
    throw error;
  }
}

export async function eliminarCita(id) {
  try {
    // Primero obtener la cita para saber si tiene disponibilidad asociada
    const cita = await obtenerCita(id);
    
    // Eliminar la cita
    const resultado = await citasApi.delete(id);
    
    // Si la cita tenía una disponibilidad asociada, liberarla
    if (cita && cita.idDisponibilidad) {
      await liberarDisponibilidad(cita.idDisponibilidad);
    }
    
    return resultado;
  } catch (error) {
    console.error(`Error al eliminar cita ${id}:`, error);
    throw error;
  }
}

// 🔥 FUNCIONES ADICIONALES - Corregidas (ahora usan las funciones básicas)
export async function buscarCitasPorPaciente(idPaciente) {
  try {
    console.log(`🔍 Buscando citas por paciente: ${idPaciente}`);
    const citas = await listarCitas();
    const resultados = citas.filter(cita => 
      cita.idPaciente === idPaciente
    );
    console.log("✅ Citas del paciente:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Error al buscar citas por paciente:', error);
    throw error;
  }
}

export async function buscarCitasPorTerapeuta(idTerapeuta) {
  try {
    console.log(`🔍 Buscando citas por terapeuta: ${idTerapeuta}`);
    const citas = await listarCitas();
    const resultados = citas.filter(cita => 
      cita.idTerapeuta === idTerapeuta
    );
    console.log("✅ Citas del terapeuta:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Error al buscar citas por terapeuta:', error);
    throw error;
  }
}

export async function filtrarCitasPorEstado(estado) {
  try {
    console.log(`🔍 Filtrando citas por estado: ${estado}`);
    const citas = await listarCitas();
    const resultados = citas.filter(cita => 
      cita.estado && cita.estado.toLowerCase() === estado.toLowerCase()
    );
    console.log("✅ Citas filtradas por estado:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Error al filtrar citas por estado:', error);
    throw error;
  }
}

export async function filtrarCitasPorTipoAtencion(tipoAtencion) {
  try {
    console.log(`🔍 Filtrando citas por tipo de atención: ${tipoAtencion}`);
    const citas = await listarCitas();
    const resultados = citas.filter(cita => 
      cita.tipoAtencion && cita.tipoAtencion.toLowerCase() === tipoAtencion.toLowerCase()
    );
    console.log("✅ Citas filtradas por tipo de atención:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Error al filtrar citas por tipo de atención:', error);
    throw error;
  }
}

export async function obtenerCitasProgramadas() {
  try {
    console.log("🔍 Obteniendo citas programadas...");
    return await filtrarCitasPorEstado("Programada");
  } catch (error) {
    console.error('❌ Error al obtener citas programadas:', error);
    throw error;
  }
}

export async function obtenerCitasConfirmadas() {
  try {
    console.log("🔍 Obteniendo citas confirmadas...");
    return await filtrarCitasPorEstado("Confirmada");
  } catch (error) {
    console.error('❌ Error al obtener citas confirmadas:', error);
    throw error;
  }
}

export async function obtenerCitasCompletadas() {
  try {
    console.log("🔍 Obteniendo citas completadas...");
    return await filtrarCitasPorEstado("Completada");
  } catch (error) {
    console.error('❌ Error al obtener citas completadas:', error);
    throw error;
  }
}

export async function obtenerCitasCanceladas() {
  try {
    console.log("🔍 Obteniendo citas canceladas...");
    return await filtrarCitasPorEstado("Cancelada");
  } catch (error) {
    console.error('❌ Error al obtener citas canceladas:', error);
    throw error;
  }
}

export async function confirmarCita(id) {
  try {
    console.log(`🔄 Confirmando cita ${id}...`);
    
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
    console.error(`❌ Error al confirmar cita:`, error);
    throw error;
  }
}

export async function cancelarCita(id) {
  try {
    console.log(`🔄 Cancelando cita ${id}...`);
    
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
    console.error(`❌ Error al cancelar cita:`, error);
    throw error;
  }
}

export async function realizarCheckIn(id) {
  try {
    console.log(`🔄 Realizando check-in para cita ${id}...`);
    
    // Primero obtener la cita actual
    const cita = await obtenerCita(id);
    
    // Actualizar el check-in con la fecha y hora actual
    const datosActualizacion = {
      ...cita,
      checkIn: new Date().toISOString()
    };
    
    return await actualizarCita(id, datosActualizacion);
  } catch (error) {
    console.error(`❌ Error al realizar check-in:`, error);
    throw error;
  }
}

export async function realizarCheckOut(id) {
  try {
    console.log(`🔄 Realizando check-out para cita ${id}...`);
    
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
    console.error(`❌ Error al realizar check-out:`, error);
    throw error;
  }
}

export async function iniciarCita(id) {
  try {
    console.log(`🔄 Iniciando cita ${id}...`);
    
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
    console.error(`❌ Error al iniciar cita:`, error);
    throw error;
  }
}

export async function finalizarCita(id) {
  try {
    console.log(`🔄 Finalizando cita ${id}...`);
    
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
    console.error(`❌ Error al finalizar cita:`, error);
    throw error;
  }
}

export async function verificarDisponibilidad(idTerapeuta, fechaHoraInicio, duracionMin) {
  try {
    console.log(`🔍 Verificando disponibilidad para terapeuta ${idTerapeuta} en ${fechaHoraInicio} por ${duracionMin} minutos...`);
    
    // Obtener todas las citas del terapeuta
    const citasTerapeuta = await buscarCitasPorTerapeuta(idTerapeuta);
    
    // Convertir la fecha de inicio a Date
    const inicioPropuesto = new Date(fechaHoraInicio);
    const finPropuesto = new Date(inicioPropuesto.getTime() + duracionMin * 60000);
    
    // Verificar superposición con citas existentes
    const tieneConflicto = citasTerapeuta.some(cita => {
      // Solo verificar citas que no estén canceladas
      if (cita.estado === "Cancelada") return false;
      
      const inicioExistente = new Date(cita.fechaHora); // Usar fechaHora que es cuando está programada
      const finExistente = new Date(inicioExistente.getTime() + (cita.duracionProgramadaMin || 30) * 60000);
      
      // Verificar superposición
      return (
        (inicioPropuesto >= inicioExistente && inicioPropuesto < finExistente) ||
        (finPropuesto > inicioExistente && finPropuesto <= finExistente) ||
        (inicioPropuesto <= inicioExistente && finPropuesto >= finExistente)
      );
    });
    
    const disponible = !tieneConflicto;
    console.log(`✅ Disponibilidad verificada:`, disponible);
    return disponible;
  } catch (error) {
    console.error('❌ Error al verificar disponibilidad:', error);
    throw error;
  }
}

export async function obtenerCitasPorRangoDeFechas(fechaInicio, fechaFin) {
  try {
    console.log(`🔍 Obteniendo citas entre ${fechaInicio} y ${fechaFin}...`);
    const citas = await listarCitas();
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
    
    const resultados = citas.filter(cita => {
      const fechaCita = new Date(cita.fechaHora);
      return fechaCita >= fechaInicioDate && fechaCita <= fechaFinDate;
    });
    
    console.log("✅ Citas en el rango de fechas:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Error al obtener citas por rango de fechas:', error);
    throw error;
  }
}

export async function obtenerCitasHoy() {
  try {
    console.log("🔍 Obteniendo citas de hoy...");
    const hoy = new Date();
    const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
    
    return await obtenerCitasPorRangoDeFechas(inicioDia, finDia);
  } catch (error) {
    console.error('❌ Error al obtener citas de hoy:', error);
    throw error;
  }
}

export async function obtenerCitasProximaSemana() {
  try {
    console.log("🔍 Obteniendo citas de la próxima semana...");
    const hoy = new Date();
    const inicioSemana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finSemana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 7);
    
    return await obtenerCitasPorRangoDeFechas(inicioSemana, finSemana);
  } catch (error) {
    console.error('❌ Error al obtener citas de la próxima semana:', error);
    throw error;
  }
}

export async function obtenerResumenCitas() {
  try {
    console.log("📊 Obteniendo resumen de citas...");
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
    
    console.log("✅ Resumen de citas:", resumen);
    return resumen;
  } catch (error) {
    console.error('❌ Error al obtener resumen de citas:', error);
    throw error;
  }
}