import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const datosUsuario = await login(usuario, contrasena);
      
      if (datosUsuario.rol === 'Administrador') {
        navigate('/gestionadmin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Botón volver al inicio */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 z-10"
      >
        <span className="mr-2">←</span>
        Volver al inicio
      </button>

      <div className="max-w-6xl w-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row border border-gray-200">
        {/* Sección izquierda - Información */}
        <div className="lg:w-1/2 bg-gray-900 text-white p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">KineSys</h1>
            <p className="text-xl text-gray-300">Sistema de Gestión para Clínicas de Fisioterapia</p>
          </div>
        </div>
      </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4 group hover:transform hover:translate-x-2 transition-transform duration-200">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-700 transition-colors duration-200">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Gestión Completa</h3>
                <p className="text-gray-300">Administra pacientes, terapeutas y citas en un solo lugar</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 group hover:transform hover:translate-x-2 transition-transform duration-200">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-700 transition-colors duration-200">
                <span className="text-xl">📅</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Agenda Inteligente</h3>
                <p className="text-gray-300">Organiza y optimiza los horarios de tu clínica</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 group hover:transform hover:translate-x-2 transition-transform duration-200">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-700 transition-colors duration-200">
                <span className="text-xl">📈</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Reportes Detallados</h3>
                <p className="text-gray-300">Analiza el rendimiento de tu clínica en tiempo real</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="usuario">Usuario</label>
              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ingrese su usuario"
                required
                disabled={cargando}
                autoComplete="username"
                className="form-input"
              />
            </div>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Más de 100 clínicas confían en nuestro sistema
            </p>
          </div>
        </div>

        {/* Sección derecha - Formulario */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h2>
              <p className="text-gray-600">Ingresa tus credenciales para acceder al sistema</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario
                </label>
                <input
                  id="usuario"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Ingrese su usuario"
                  required
                  disabled={cargando}
                  autoComplete="username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
                />
              </div>

              <div>
                <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="contrasena"
                    type={mostrarContrasena ? "text" : "password"}
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={cargando}
                    autoComplete="current-password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed pr-12 bg-white"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                    aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                    tabIndex={-1}
                  >
                    {mostrarContrasena ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m9.02 9.02l3.411 3.411" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {cargando ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                ¿Problemas para acceder?{' '}
                <button className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200">
                  Contacta al administrador
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}