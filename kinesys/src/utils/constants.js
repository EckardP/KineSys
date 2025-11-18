/**
 * Roles de usuario - DEBEN COINCIDIR con el enum Rol del backend
 */
export const ROLES = {
  ADMINISTRADOR: 'Administrador',
  TERAPEUTA: 'Terapeuta',
  PACIENTE: 'Paciente'
};

/**
 * Verifica si un usuario tiene un rol específico
 */
export const hasRole = (usuario, rol) => {
  return usuario?.rol === rol;
};

/**
 * Verifica si un usuario tiene alguno de los roles especificados
 */
export const hasAnyRole = (usuario, roles) => {
  return roles.includes(usuario?.rol);
};
