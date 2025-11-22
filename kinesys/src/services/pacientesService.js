import pacientesApi from "../api/pacientesApi";

export async function listarPacientes() {
  try {
    console.log("🔄 Servicio: Listando pacientes...")
    const todasLasPersonas = await pacientesApi.getAll()
    console.log("📦 Servicio: Todas las personas:", todasLasPersonas)

    // Filtrar solo pacientes (rol = 1)
    const pacientes = todasLasPersonas.filter(persona => persona.rol === 1)
    console.log("✅ Servicio: Pacientes filtrados:", pacientes)

    return pacientes
  } catch (error) {
    console.error('❌ Servicio: Error al listar pacientes:', error)
    throw error
  }
}

// 🔥 AGREGAR ESTA FUNCIÓN QUE FALTA
export async function obtenerPaciente(id) {
  try {
    console.log(`🔄 Servicio: Obteniendo paciente ${id}...`)
    const persona = await pacientesApi.getById(id)
    
    // Verificar que sea un paciente
    if (persona.rol !== 1) {
      throw new Error('La persona encontrada no es un paciente')
    }
    
    console.log("✅ Servicio: Paciente obtenido:", persona)
    return persona
  } catch (error) {
    console.error(`❌ Servicio: Error al obtener paciente ${id}:`, error)
    throw error
  }
}

// 🔥 O puedes renombrar la función existente para que coincida
//export const obtenerPaciente = obtenerPacientePorId; // Esta línea reemplaza a obtenerPacientePorId

export async function crearPaciente(data) {
  try {
    console.log("Servicio: Creando paciente con datos:", data);

    const datosCompletos = {
      ...data,
      user: data.documentoIdentidad,
      password: data.documentoIdentidad,
      activo: true,
      fechaRegistro: new Date().toISOString()
    };

    console.log("Servicio: Datos completos a enviar:", datosCompletos);

    const resultado = await pacientesApi.create("/Register", datosCompletos);
    console.log("Servicio: Paciente creado exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Servicio: Error al crear paciente:', error);
    if (error.message.includes('409') || error.response?.status === 409) {
      throw new Error('Ya existe un paciente con ese documento de identidad');
    }
    throw error;
  }
}

export async function actualizarPaciente(id, data) {
  try {
    console.log(`🔄 Servicio: Actualizando paciente ${id} con datos:`, data);
    
    const resultado = await pacientesApi.update(`Update/${id}`, data);
    
    console.log("✅ Servicio: Paciente actualizado exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error(`❌ Servicio: Error al actualizar paciente ${id}:`, error);
    throw error;
  }
}

export async function eliminarPaciente(id) {
  try {
    console.log(`🔄 Servicio: Eliminando paciente ${id}...`);
    return await pacientesApi.delete(`${id}`);
  } catch (error) {
    console.error(`❌ Servicio: Error al eliminar paciente ${id}:`, error);
    throw error;
  }
}