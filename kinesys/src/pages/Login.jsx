// src/pages/Login.jsx
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUserTemp, ROLES } from '../utils/auth'; // Importa la función de login temporal

export default function Login() { // Renombrado a Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Limpia errores previos

    // SIMULACIÓN DE AUTENTICACIÓN:
    // Aquí puedes poner una lógica simple para simular roles.
    // Por ejemplo:
    if (email === 'admin@kinesys.com' && password === 'admin123') {
      loginUserTemp(ROLES.ADMIN);
      navigate('/admin');
    } else if (email === 'terapeuta@kinesys.com' && password === 'terapeuta123') {
      loginUserTemp(ROLES.TERAPEUTA);
      navigate('/terapeuta');
    } else if (email === 'paciente@kinesys.com' && password === 'paciente123') {
      loginUserTemp(ROLES.PACIENTE);
      navigate('/paciente');
    } else {
      setError('Credenciales inválidas. Intenta con admin@kinesys.com / admin123');
    }

    // CUANDO IMPLEMENTES EL BACKEND, ESTA LÓGICA CAMBIARÁ:
    // const response = await fetch('/api/auth/login', { /* ... */ });
    // const data = await response.json();
    // if (response.ok) {
    //   loginUserTemp(data.role); // Usar el rol real del backend
    //   navigate(`/dashboard/${data.role.toLowerCase()}`);
    // } else {
    //   setError(data.message || 'Error en el inicio de sesión');
    // }
  };

  return (
    <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)', // Resta la altura del navbar y footer
        backgroundColor: '#f8f9fa' // Color de fondo claro
      }}>
      <div style={{
          backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          maxWidth: '400px', width: '100%', textAlign: 'center'
        }}>
        <h2 style={{ marginBottom: '25px', color: '#343a40' }}>Acceder a KineSys</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              className="form-control" // Clase de Bootstrap
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ced4da' }}
            />
          </div>
          <div style={{ marginBottom: '25px', textAlign: 'left' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contraseña:</label>
            <input
              type="password"
              id="password"
              className="form-control" // Clase de Bootstrap
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ced4da' }}
            />
          </div>
          {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" // Clase de Bootstrap
            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', fontSize: '16px', cursor: 'pointer' }}>
            Iniciar Sesión
          </button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '0.9em', color: '#6c757d' }}>
          ¿Olvidaste tu contraseña? <Link to="/forgot-password">Recuperar</Link>
        </p>
      </div>
    </div>
  );
}