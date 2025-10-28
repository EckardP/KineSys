// src/utils/auth.js

// Funciones para simular la sesión
export const loginUserTemp = (role = 'Admin') => {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userRole', role); // Guardamos un rol simulado
};

export const logoutUserTemp = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
};

export const checkAuthTemp = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const getUserRoleTemp = () => {
  return localStorage.getItem('userRole') || null;
};

// Roles simulados para facilitar las pruebas
export const ROLES = {
  ADMIN: 'Admin',
  TERAPEUTA: 'Terapeuta',
  PACIENTE: 'Paciente',
};