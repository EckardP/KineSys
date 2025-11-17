import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook para acceder a los datos de autenticación
 * @returns {object} Objeto con usuario, token, loading, isAuthenticated, login, logout
 */
export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return contexto;
}
