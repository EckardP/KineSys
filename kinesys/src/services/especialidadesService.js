import especialidadesApi from "../api/especialidadesApi";

export async function listarEspecialidades() {
  try {
    console.log("🔄 Servicio: Listando especialidades...");
    const especialidades = await especialidadesApi.getAll();
    console.log("✅ Servicio: Especialidades obtenidas:", especialidades);
    return especialidades;
  } catch (error) {
    console.error('❌ Servicio: Error al listar especialidades:', error);
    throw error;
  }
}

export async function obtenerEspecialidad(id) {
  try {
    console.log(`🔄 Servicio: Obteniendo especialidad ${id}...`);
    const especialidad = await especialidadesApi.getById(id);
    console.log("✅ Servicio: Especialidad obtenida:", especialidad);
    return especialidad;
  } catch (error) {
    console.error(`❌ Servicio: Error al obtener especialidad ${id}:`, error);
    throw error;
  }
}

export async function crearEspecialidad(data) {
  try {
    console.log("🔄 Servicio: Creando especialidad con datos:", data);
    
    const datosCompletos = {
      nombre: data.nombre || "",
      descripcion: data.descripcion || ""
    };

    const resultado = await especialidadesApi.create('', datosCompletos);
    console.log("✅ Servicio: Especialidad creada exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Servicio: Error al crear especialidad:', error);
    
    // Manejo específico de errores
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('Ya existe una especialidad con ese nombre');
    }
    
    throw error;
  }
}

export async function actualizarEspecialidad(id, data) {
  try {
    console.log(`🔄 Servicio: Actualizando especialidad ${id} con datos:`, data);
    
    const datosActualizacion = {
      id: id,
      nombre: data.nombre || "",
      descripcion: data.descripcion || ""
    };
    
    const resultado = await especialidadesApi.update(`/${id}`, datosActualizacion);
    console.log("✅ Servicio: Especialidad actualizada exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al actualizar especialidad ${id}:`, error);
    throw error;
  }
}

export async function eliminarEspecialidad(id) {
  try {
    console.log(`🔄 Servicio: Eliminando especialidad ${id}...`);
    const resultado = await especialidadesApi.delete(id);
    console.log("✅ Servicio: Especialidad eliminada exitosamente");
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al eliminar especialidad ${id}:`, error);
    
    // Manejo específico para cuando no se puede eliminar por relaciones
    if (error.message.includes('409') || error.message.includes('Conflict')) {
      throw new Error('No se puede eliminar la especialidad porque está asociada a terapeutas');
    }
    
    throw error;
  }
}

// Funciones adicionales útiles para especialidades
export async function buscarEspecialidadesPorNombre(nombre) {
  try {
    console.log(`🔍 Servicio: Buscando especialidades por nombre: ${nombre}`);
    const especialidades = await listarEspecialidades();
    const resultados = especialidades.filter(esp => 
      esp.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
    console.log("✅ Servicio: Especialidades encontradas:", resultados);
    return resultados;
  } catch (error) {
    console.error('❌ Servicio: Error al buscar especialidades por nombre:', error);
    throw error;
  }
}

export async function verificarEspecialidadExistente(nombre) {
  try {
    console.log(`🔍 Servicio: Verificando existencia de especialidad: ${nombre}`);
    const especialidades = await listarEspecialidades();
    const existe = especialidades.some(esp => 
      esp.nombre.toLowerCase() === nombre.toLowerCase()
    );
    console.log(`✅ Servicio: Especialidad "${nombre}" existe:`, existe);
    return existe;
  } catch (error) {
    console.error('❌ Servicio: Error al verificar existencia de especialidad:', error);
    throw error;
  }
}