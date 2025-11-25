import terapeutasApi from "../api/terapeutasApi";

export async function listarTerapeutas() {
  try {
    console.log("🔄 Servicio: Listando terapeutas...")
    const todasLasPersonas = await terapeutasApi.getAll()
    console.log("📦 Servicio: Todas las personas:", todasLasPersonas)

    // Filtrar solo terapeutas (rol = 2)
    const terapeutas = todasLasPersonas.filter(persona => persona.rol === 2)
    console.log("✅ Servicio: Terapeutas filtrados:", terapeutas)

    return terapeutas
  } catch (error) {
    console.error('❌ Servicio: Error al listar terapeutas:', error)
    throw error
  }
}

export async function obtenerTerapeuta(id) {
  try {
    console.log(`🔄 Servicio: Obteniendo terapeuta ${id}...`)
    const persona = await terapeutasApi.getById(id)
    
    // Verificar que sea un terapeuta
    if (persona.rol !== 2) {
      throw new Error('La persona encontrada no es un terapeuta')
    }
    
    console.log("✅ Servicio: Terapeuta obtenido:", persona)
    return persona
  } catch (error) {
    console.error(`❌ Servicio: Error al obtener terapeuta ${id}:`, error)
    throw error
  }
}

export async function crearTerapeuta(data) {
  try {
    console.log("Servicio: Creando terapeuta con datos:", data);

    const datosCompletos = {
      ...data,
      activo: true,
      fechaRegistro: new Date().toISOString(),
      rol: 2, // Rol Terapeuta
      // Campos específicos de terapeuta - hacerlos nullable según el modelo
    };

    console.log("Servicio: Datos completos a enviar:", datosCompletos);

    const resultado = await terapeutasApi.create("/Register", datosCompletos);
    console.log("Servicio: Terapeuta creado exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Servicio: Error al crear terapeuta:', error);
    if (error.message.includes('409') || error.response?.status === 409) {
      throw new Error('Ya existe un terapeuta con ese documento de identidad');
    }
    throw error;
  }
}

export async function actualizarTerapeuta(id, data) {
  try {
    console.log(`🔄 Servicio: Actualizando terapeuta ${id} con datos:`, data);
    
    const datosActualizacion = {
      ...data,
      rol: 2, // Asegurar que el rol sea Terapeuta
      // Campos específicos de terapeuta
      noLicencia: data.noLicencia || "",
      tituloAcademico: data.tituloAcademico || "",
      añosExperiencia: data.añosExperiencia || 0,
      fechaContratacion: data.fechaContratacion || new Date().toISOString()
    };
    
    const resultado = await terapeutasApi.update(`/Update/${id}`, datosActualizacion);
    
    console.log("✅ Servicio: Terapeuta actualizado exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al actualizar terapeuta ${id}:`, error);
    throw error;
  }
}

export async function eliminarTerapeuta(id) {
  try {
    console.log(`🔄 Servicio: Eliminando terapeuta ${id}...`);
    return await terapeutasApi.delete(`${id}`);
  } catch (error) {
    console.error(`❌ Servicio: Error al eliminar terapeuta ${id}:`, error);
    throw error;
  }
}

// Funciones específicas para terapeutas
export async function obtenerTerapeutasActivos() {
  try {
    const terapeutas = await listarTerapeutas();
    return terapeutas.filter(terapeuta => terapeuta.activo === true);
  } catch (error) {
    console.error('❌ Servicio: Error al obtener terapeutas activos:', error);
    throw error;
  }
}

export async function buscarTerapeutasPorEspecialidad(especialidad) {
  try {
    const terapeutas = await listarTerapeutas();
    // Nota: Necesitarías agregar el campo especialidad al modelo Terapeuta
    return terapeutas.filter(terapeuta => 
      terapeuta.tituloAcademico?.toLowerCase().includes(especialidad.toLowerCase())
    );
  } catch (error) {
    console.error('❌ Servicio: Error al buscar terapeutas por especialidad:', error);
    throw error;
  }
}