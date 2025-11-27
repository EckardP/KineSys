// FUNCIONES ESPECIALIZADAS CON ENDPOINTS PERSONALIZADOS
import terapeutaEspecialidadesApi from "@/api/terapeutaEspecialidadesApi";

// src/services/terapeutaEspecialidadesService.js

// src/services/terapeutaEspecialidadesService.js

export async function obtenerEspecialidadesPorTerapeuta(idTerapeuta) {
  try {
    console.log(`🔍 Servicio: Obteniendo especialidades del terapeuta ${idTerapeuta}...`);
    const especialidades = await terapeutaEspecialidadesApi.getAllCustom(`/por-terapeuta/${idTerapeuta}`);
    
    // DEBUG: Ver la estructura completa de la respuesta
    console.log(`📊 ESTRUCTURA COMPLETA para terapeuta ${idTerapeuta}:`, JSON.stringify(especialidades, null, 2));
    
    if (especialidades.length > 0) {
      console.log(`🔍 Primer elemento detallado:`, {
        id: especialidades[0].idTerapeutaEspecialidad,
        idEspecialidad: especialidades[0].idEspecialidad,
        nombre: especialidades[0].nombre,
        nombreEspecialidad: especialidades[0].nombreEspecialidad,
        especialidad: especialidades[0].especialidad,
        todasLasPropiedades: Object.keys(especialidades[0])
      });
    }
    
    // Si las especialidades vienen con nombre, usarlo directamente
    const especialidadesConNombres = especialidades.map(esp => {
      // Si ya viene con nombre, usarlo
      if (esp.nombre) {
        return esp;
      }
      
      // Si viene en un campo anidado
      if (esp.especialidad && esp.especialidad.nombre) {
        return {
          ...esp,
          nombre: esp.especialidad.nombre
        };
      }
      
      // Si no tiene nombre, mantener la estructura original
      return esp;
    });
    
    console.log("✅ Servicio: Especialidades del terapeuta (procesadas):", especialidadesConNombres);
    return especialidadesConNombres;
  } catch (error) {
    if (error.message.includes('404')) {
      console.log("ℹ️ Servicio: No se encontraron especialidades para el terapeuta");
      return [];
    }
    
    console.warn('⚠️ Servicio: Error al obtener especialidades por terapeuta:', error.message);
    return [];
  }
}

// Agregar esta función si no existe
export async function obtenerEspecialidadPorId(idEspecialidad) {
  try {
    // Asumiendo que tienes un servicio para especialidades
    const response = await fetch(`/api/especialidades/${idEspecialidad}`);
    return await response.json();
  } catch (error) {
    console.error('Error al obtener especialidad por ID:', error);
    return { id: idEspecialidad, nombre: `Especialidad ${idEspecialidad}` };
  }
}

export async function verificarRelacionExistente(idTerapeuta, idEspecialidad) {
  try {
    console.log(`🔍 Servicio: Verificando si la relación terapeuta ${idTerapeuta} - especialidad ${idEspecialidad} ya existe...`);
    const especialidades = await obtenerEspecialidadesPorTerapeuta(idTerapeuta);
    const existe = especialidades.some(relacion => 
      relacion.idEspecialidad === idEspecialidad
    );
    console.log(`✅ Servicio: Relación existe:`, existe);
    return existe;
  } catch (error) {
    console.warn('⚠️ Servicio: Error al verificar existencia de relación, asumiendo que no existe:', error.message);
    return false;
  }
}

export async function agregarEspecialidadATerapeuta(idTerapeuta, idEspecialidad, datosAdicionales = {}) {
  try {
    console.log(`🔄 Servicio: Agregando especialidad ${idEspecialidad} a terapeuta ${idTerapeuta}...`);
    
    // Verificar si ya existe la relación
    const existe = await verificarRelacionExistente(idTerapeuta, idEspecialidad);
    if (existe) {
      throw new Error('El terapeuta ya tiene esta especialidad asignada');
    }
    
    const datos = {
      idTerapeuta: idTerapeuta,
      idEspecialidad: idEspecialidad,
      fechaCertificacion: datosAdicionales.fechaCertificacion || new Date().toISOString(),
      numeroCertificado: datosAdicionales.numeroCertificado || "",
      esPrincipal: datosAdicionales.esPrincipal || false
    };
    
    console.log("📤 Servicio: Enviando datos para crear relación:", datos);
    const resultado = await terapeutaEspecialidadesApi.create("", datos);
    console.log("✅ Servicio: Relación creada exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al agregar especialidad a terapeuta:`, error);
    throw error;
  }
}

export async function eliminarRelacionPorIds(idTerapeuta, idEspecialidad) {
  try {
    console.log(`🔄 Servicio: Eliminando relación terapeuta ${idTerapeuta} - especialidad ${idEspecialidad}...`);
    
    const especialidades = await obtenerEspecialidadesPorTerapeuta(idTerapeuta);
    const relacion = especialidades.find(rel => 
      rel.idEspecialidad === idEspecialidad
    );
    
    if (!relacion) {
      throw new Error('No se encontró la relación especificada');
    }
    
    return await terapeutaEspecialidadesApi.delete(`/${relacion.idTerapeutaEspecialidad}`);
  } catch (error) {
    console.error(`❌ Servicio: Error al eliminar relación por IDs:`, error);
    throw error;
  }
}