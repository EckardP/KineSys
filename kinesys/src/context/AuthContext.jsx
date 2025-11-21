import React, { createContext, useState, useEffect } from 'react';
import { extraerDatosUsuario } from '../utils/jwt';
import { API_BASE_URL } from '../config/apiConfig';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Al cargar, verificar si hay token guardado
   */
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('authToken');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (tokenGuardado && usuarioGuardado) {
      try {
        const datosUsuario = JSON.parse(usuarioGuardado);
        setToken(tokenGuardado);
        setUsuario(datosUsuario);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al recuperar datos guardados:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('usuario');
      }
    }

    setLoading(false);
  }, []);

  /**
   * Función para hacer login
   */
  const login = async (usuario, contrasena) => {
    try {
      const respuesta = await fetch(`${API_BASE_URL}/Personas/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          User: usuario, 
          Password: contrasena 
        })
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        throw new Error(errorData.message || 'Credenciales inválidas');
      }

      const datos = await respuesta.json();
      const nuevoToken = datos.Token || datos.token;

      // Extraer datos del token JWT - CORREGIDO
      const datosDelToken = extraerDatosUsuario(nuevoToken);

      console.log('Datos del token:', datosDelToken); // Para debug

      // Combinar datos - USAR LOS DATOS DEL TOKEN QUE SÍ TIENEN LA INFORMACIÓN
      const datosUsuario = {
        id: datos.Id || datosDelToken.id,
        nombre: datos.Nombres || datosDelToken.nombre, 
        apellidos: datos.Apellidos || datosDelToken.apellidos,
        // USAR EL FullName DEL TOKEN QUE SÍ CONTIENE LOS DATOS CORRECTOS
        nombreCompleto: datosDelToken.nombreCompleto || `${datos.Nombres} ${datos.Apellidos}`,
        usuario: usuario,
        rol: datosDelToken.rol,
        email: datosDelToken.email
      };

      console.log('Datos usuario a guardar:', datosUsuario); // Para debug

      // Guardar en localStorage
      localStorage.setItem('authToken', nuevoToken);
      localStorage.setItem('usuario', JSON.stringify(datosUsuario));

      // Actualizar estado
      setToken(nuevoToken);
      setUsuario(datosUsuario);
      setIsAuthenticated(true);

      return datosUsuario;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  /**
   * Función para hacer logout
   */
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
    setIsAuthenticated(false);
  };

  const valor = {
    usuario,
    token,
    loading,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
