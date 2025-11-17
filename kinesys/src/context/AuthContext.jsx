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
      // Endpoint correcto según PersonasController
      const respuesta = await fetch(`${API_BASE_URL}/Personas/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Body con estructura User y Password como espera la API
        body: JSON.stringify({ 
          User: usuario, 
          Password: contrasena 
        })
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        throw new Error(errorData.message || 'Credenciales inválidas');
      }

      // La API retorna: { Id, Nombres, Apellidos, Token }
      const datos = await respuesta.json();
      const nuevoToken = datos.Token || datos.token;

      // Extraer rol y otros datos del token JWT
      const datosDelToken = extraerDatosUsuario(nuevoToken);

      // Combinar datos de la respuesta con datos del token
      const datosUsuario = {
        id: datos.Id,
        nombre: datos.Nombres,
        apellidos: datos.Apellidos,
        nombreCompleto: `${datos.Nombres} ${datos.Apellidos}`,
        usuario: usuario,
        rol: datosDelToken.rol, // El rol viene en el token
        email: datosDelToken.email // El email viene en el token
      };

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
