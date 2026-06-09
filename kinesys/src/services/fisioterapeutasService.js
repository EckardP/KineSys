import fisioterapeutasApi from "../api/fisioterapeutasApi";
import correoService from "../api/correoService";

export async function listarFisioterapeutas() {
  try {
    const respuesta = await fisioterapeutasApi.getAll();
    return respuesta;
  } catch (error) {
    console.error("Error al listar fisioterapeutas:", error);
    throw error;
  }
}

export async function crearFisioterapeuta(data) {
  try {
    const credenciales = {
      usuario: data.documentoIdentidad,
      contrasena: generarContrasena(data.documentoIdentidad),
    };

    const datosCompletos = {
      ...data,
      credenciales,
      activo: true,
      fechaRegistro: new Date().toISOString(),
    };

    const resultado = await fisioterapeutasApi.post("/Fisioterapeutas", datosCompletos);

    await enviarCorreoCredenciales(data.correoElectronico, credenciales);

    return resultado;
  } catch (error) {
    console.error("Error al crear fisioterapeuta:", error);
    if (error.response?.status === 409) {
      if (error.response?.data?.includes("documento")) {
        throw new Error("Ya existe un fisioterapeuta con ese documento de identidad");
      }
      if (error.response?.data?.includes("tarjeta")) {
        throw new Error("Ya existe un fisioterapeuta con esa tarjeta profesional");
      }
    }
    throw error;
  }
}

export async function actualizarFisioterapeuta(id, data) {
  try {
    return await fisioterapeutasApi.put(`/Fisioterapeutas/${id}`, data);
  } catch (error) {
    console.error(`Error al actualizar fisioterapeuta ${id}:`, error);
    throw error;
  }
}

export async function eliminarFisioterapeuta(id) {
  try {
    return await fisioterapeutasApi.delete(`/Fisioterapeutas/${id}`);
  } catch (error) {
    console.error(`Error al eliminar fisioterapeuta ${id}:`, error);
    throw error;
  }
}

function generarContrasena(documentoIdentidad) {
  const base = documentoIdentidad.slice(-4);
  const aleatorio = Math.random().toString(36).slice(-4);
  return `${base}${aleatorio}`.toUpperCase();
}

async function enviarCorreoCredenciales(correo, credenciales) {
  try {
    await correoService.enviarCredenciales(correo, credenciales.usuario, credenciales.contrasena);
  } catch (error) {
    console.error("Error al enviar correo:", error);
    throw new Error("No se pudo enviar el correo con las credenciales");
  }
}
