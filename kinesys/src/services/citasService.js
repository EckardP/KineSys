import citasApi from "../api/citasApi";
import { actualizarDisponibilidad, liberarDisponibilidad } from "./disponibilidadTerapeutaService";

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
    const { idDisponibilidad, ...datosCita } = data;
    const citaCreada = await citasApi.create('', datosCita);

    if (citaCreada?.idCita && idDisponibilidad) {
      try {
        await actualizarDisponibilidad(idDisponibilidad, {
          idCita: citaCreada.idCita,
          disponible: false
        });
        citaCreada.idDisponibilidad = idDisponibilidad;
      } catch (error) {
        console.error("Error al actualizar disponibilidad:", error);
        await eliminarCita(citaCreada.idCita);
        throw new Error("Error al reservar el horario. La cita no pudo ser agendada.");
      }
    }

    return citaCreada;
  } catch (error) {
    console.error("Error al crear cita:", error);
    throw error;
  }
}

export async function actualizarCita(id, data) {
  try {
    const { idDisponibilidad, ...datosCita } = data;
    const citaActualizada = await citasApi.update(`/${id}`, datosCita);

    if (citaActualizada && idDisponibilidad) {
      try {
        await actualizarDisponibilidad(idDisponibilidad, {
          idCita: citaActualizada.idCita,
          disponible: false
        });
      } catch (error) {
        console.error("Error al actualizar disponibilidad:", error);
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
    const cita = await obtenerCita(id);
    const resultado = await citasApi.delete(id);
    if (cita?.idDisponibilidad) {
      await liberarDisponibilidad(cita.idDisponibilidad);
    }
    return resultado;
  } catch (error) {
    console.error(`Error al eliminar cita ${id}:`, error);
    throw error;
  }
}

export async function buscarCitasPorPaciente(idPaciente) {
  try {
    const citas = await listarCitas();
    return citas.filter(cita => cita.idPaciente === idPaciente);
  } catch (error) {
    console.error('Error al buscar citas por paciente:', error);
    throw error;
  }
}

export async function buscarCitasPorTerapeuta(idTerapeuta) {
  try {
    const citas = await listarCitas();
    return citas.filter(cita => cita.idTerapeuta === idTerapeuta);
  } catch (error) {
    console.error('Error al buscar citas por terapeuta:', error);
    throw error;
  }
}

export async function filtrarCitasPorEstado(estado) {
  try {
    const citas = await listarCitas();
    return citas.filter(cita =>
      cita.estado && cita.estado.toLowerCase() === estado.toLowerCase()
    );
  } catch (error) {
    console.error('Error al filtrar citas por estado:', error);
    throw error;
  }
}

export async function filtrarCitasPorTipoAtencion(tipoAtencion) {
  try {
    const citas = await listarCitas();
    return citas.filter(cita =>
      cita.tipoAtencion && cita.tipoAtencion.toLowerCase() === tipoAtencion.toLowerCase()
    );
  } catch (error) {
    console.error('Error al filtrar citas por tipo de atención:', error);
    throw error;
  }
}

export const obtenerCitasProgramadas = () => filtrarCitasPorEstado("Programada");
export const obtenerCitasConfirmadas = () => filtrarCitasPorEstado("Confirmada");
export const obtenerCitasCompletadas = () => filtrarCitasPorEstado("Completada");
export const obtenerCitasCanceladas = () => filtrarCitasPorEstado("Cancelada");

export async function confirmarCita(id) {
  try {
    const cita = await obtenerCita(id);
    return await actualizarCita(id, { ...cita, estado: "Confirmada", confirmada: true });
  } catch (error) {
    console.error(`Error al confirmar cita ${id}:`, error);
    throw error;
  }
}

export async function cancelarCita(id) {
  try {
    const cita = await obtenerCita(id);
    return await actualizarCita(id, { ...cita, estado: "Cancelada", confirmada: false });
  } catch (error) {
    console.error(`Error al cancelar cita ${id}:`, error);
    throw error;
  }
}

export async function realizarCheckIn(id) {
  try {
    const cita = await obtenerCita(id);
    return await actualizarCita(id, { ...cita, checkIn: new Date().toISOString() });
  } catch (error) {
    console.error(`Error al realizar check-in de cita ${id}:`, error);
    throw error;
  }
}

export async function realizarCheckOut(id) {
  try {
    const cita = await obtenerCita(id);
    return await actualizarCita(id, { ...cita, checkOut: new Date().toISOString(), estado: "Completada" });
  } catch (error) {
    console.error(`Error al realizar check-out de cita ${id}:`, error);
    throw error;
  }
}

export async function iniciarCita(id) {
  try {
    const cita = await obtenerCita(id);
    return await actualizarCita(id, { ...cita, horaInicioReal: new Date().toISOString(), estado: "En Progreso" });
  } catch (error) {
    console.error(`Error al iniciar cita ${id}:`, error);
    throw error;
  }
}

export async function finalizarCita(id) {
  try {
    const cita = await obtenerCita(id);
    return await actualizarCita(id, { ...cita, horaFinReal: new Date().toISOString(), estado: "Completada" });
  } catch (error) {
    console.error(`Error al finalizar cita ${id}:`, error);
    throw error;
  }
}

export async function verificarDisponibilidad(idTerapeuta, fechaHoraInicio, duracionMin) {
  try {
    const citasTerapeuta = await buscarCitasPorTerapeuta(idTerapeuta);
    const inicioPropuesto = new Date(fechaHoraInicio);
    const finPropuesto = new Date(inicioPropuesto.getTime() + duracionMin * 60000);

    const tieneConflicto = citasTerapeuta.some(cita => {
      if (cita.estado === "Cancelada") return false;
      const inicioExistente = new Date(cita.fechaHora);
      const finExistente = new Date(inicioExistente.getTime() + (cita.duracionProgramadaMin || 30) * 60000);
      return (
        (inicioPropuesto >= inicioExistente && inicioPropuesto < finExistente) ||
        (finPropuesto > inicioExistente && finPropuesto <= finExistente) ||
        (inicioPropuesto <= inicioExistente && finPropuesto >= finExistente)
      );
    });

    return !tieneConflicto;
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    throw error;
  }
}

export async function obtenerCitasPorRangoDeFechas(fechaInicio, fechaFin) {
  try {
    const citas = await listarCitas();
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
    return citas.filter(cita => {
      const fechaCita = new Date(cita.fechaHora);
      return fechaCita >= fechaInicioDate && fechaCita <= fechaFinDate;
    });
  } catch (error) {
    console.error('Error al obtener citas por rango de fechas:', error);
    throw error;
  }
}

export async function obtenerCitasHoy() {
  try {
    const hoy = new Date();
    const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
    return await obtenerCitasPorRangoDeFechas(inicioDia, finDia);
  } catch (error) {
    console.error('Error al obtener citas de hoy:', error);
    throw error;
  }
}

export async function obtenerCitasProximaSemana() {
  try {
    const hoy = new Date();
    const inicioSemana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finSemana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 7);
    return await obtenerCitasPorRangoDeFechas(inicioSemana, finSemana);
  } catch (error) {
    console.error('Error al obtener citas de la próxima semana:', error);
    throw error;
  }
}

export async function obtenerResumenCitas() {
  try {
    const citas = await listarCitas();
    return {
      total: citas.length,
      programadas: citas.filter(c => c.estado === "Programada").length,
      confirmadas: citas.filter(c => c.estado === "Confirmada").length,
      enProgreso: citas.filter(c => c.estado === "En Progreso").length,
      completadas: citas.filter(c => c.estado === "Completada").length,
      canceladas: citas.filter(c => c.estado === "Cancelada").length,
      ingresosTotales: citas.reduce((sum, cita) => sum + (cita.precioCita || 0), 0)
    };
  } catch (error) {
    console.error('Error al obtener resumen de citas:', error);
    throw error;
  }
}
