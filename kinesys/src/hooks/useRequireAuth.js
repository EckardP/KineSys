import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { ROLES } from '../utils/constants';

/**
 * Hook para proteger rutas que requieren autenticación
 * Si el usuario no está autenticado, redirige a /login
 * @param {array} rolesPermitidos - Array de roles permitidos
 */
export function useRequireAuth(rolesPermitidos = []) {
  const navigate = useNavigate();
  const { isAuthenticated, loading, usuario } = useAuth();

  useEffect(() => {
    if (loading) return;

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    // Si hay roles permitidos especificados, verificar que el usuario tenga uno
    if (rolesPermitidos.length > 0 && usuario) {
      if (!rolesPermitidos.includes(usuario.rol)) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, loading, usuario, rolesPermitidos, navigate]);

  return { isAuthenticated, loading, usuario };
}
