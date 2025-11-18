import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Login.css';

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
      
      // Redirigir según el rol
      if (datosUsuario.rol === 'Administrador') {
        navigate('/gestionadmin');
      } else if (datosUsuario.rol === 'Terapeuta') {
        navigate('/dashboard');
      } else if (datosUsuario.rol === 'Paciente') {
        navigate('/dashboard');
      } else if (datosUsuario.rol === 'Despachadora') {
        navigate('/dashboard');
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
    <div className="login-page">
      <button 
        onClick={() => navigate('/')} 
        className="back-to-home-btn"
        aria-label="Volver al inicio"
      >
        <span className="back-arrow">←</span>
        Volver al inicio
      </button>

      <div className="login-hero">
        <div className="login-hero-content">
          <h1 className="login-hero-title">KineSys</h1>
          <p className="login-hero-subtitle">Sistema de Gestión para Clínicas de Fisioterapia</p>
          
          <div className="login-hero-features">
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div className="feature-text">
                <h3>Gestión Completa</h3>
                <p>Administra pacientes, terapeutas y citas en un solo lugar</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">📅</div>
              <div className="feature-text">
                <h3>Agenda Inteligente</h3>
                <p>Organiza y optimiza los horarios de tu clínica</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">📈</div>
              <div className="feature-text">
                <h3>Reportes Detallados</h3>
                <p>Analiza el rendimiento de tu clínica en tiempo real</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-form-section">
        <div className="login-form-container">
          <div className="login-form-header">
            <h2>Bienvenido</h2>
            <p>Ingresa tus credenciales para acceder al sistema</p>
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

            <div className="form-group">
              <label htmlFor="contrasena">Contraseña</label>
              <div className="password-input-wrapper">
                <input
                  id="contrasena"
                  type={mostrarContrasena ? "text" : "password"}
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={cargando}
                  autoComplete="current-password"
                  className="form-input"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                  tabIndex={-1}
                >
                  {mostrarContrasena ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <button type="submit" disabled={cargando} className="submit-btn">
              {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="login-footer">
            <p>¿Problemas para acceder? Contacta al administrador</p>
          </div>
        </div>
      </div>
    </div>
  );
}
