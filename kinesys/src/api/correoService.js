const correoService = {
  enviarCredenciales: async (correo, usuario, contrasena) => {
    return Promise.resolve({ success: true });
  },
  enviarNotificacion: async (correo, asunto, mensaje) => {
    return Promise.resolve({ success: true });
  },
};

export default correoService;
