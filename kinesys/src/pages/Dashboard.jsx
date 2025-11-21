import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRequireAuth } from '../hooks/useRequireAuth';
import '../styles/dashboard.css';

export default function Dashboard() {
  useRequireAuth();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const getMenuOptions = () => {
    switch (usuario?.rol) {
      case 'Administrador':
        return [
          { title: 'Gestión Admin', description: 'Panel de administración completo', path: '/gestionadmin' },
          { title: 'Pacientes', description: 'Gestiona los pacientes de la clínica', path: '/pacientes' },
          { title: 'Terapeutas', description: 'Administra los terapeutas', path: '/gestionterapeuta/terapeuta' },
          { title: 'Agenda', description: 'Visualiza y gestiona la agenda', path: '/gestionagenda/agendaadmin' },
          { title: 'Reportes', description: 'Visualiza reportes del sistema', path: '/gestionreporte/reportes' },
          { title: 'Citas', description: 'Gestiona todas las citas', path: '/gestioncita/citas' },
        ];
      
      case 'Terapeuta':
        return [
          { title: 'Mis Pacientes', description: 'Pacientes asignados a ti', path: '/pacientes' },
          { title: 'Mi Agenda', description: 'Consulta tu agenda de citas', path: '/agenda' },
          { title: 'Citas', description: 'Gestiona tus citas', path: '/gestioncita/citas' },
        ];
      
      case 'Paciente':
        return [
          { title: 'Mis Citas', description: 'Consulta tus citas programadas', path: '/agenda' },
          { title: 'Mi Perfil', description: 'Información personal', path: '/perfil' },
        ];
      
      case 'Despachadora':
        return [
          { title: 'Agenda', description: 'Gestiona la agenda de citas', path: '/gestionagenda/agendaadmin' },
          { title: 'Pacientes', description: 'Información de pacientes', path: '/pacientes' },
          { title: 'Citas', description: 'Gestiona las citas', path: '/gestioncita/citas' },
        ];
      
      default:
        return [];
    }
  };

  const menuOptions = getMenuOptions();

  return (
    <div className="dashboard-container">
      
      <div className="dashboard-content">
        <h1>Bienvenido, {usuario?.nombre}</h1>
        <p className="welcome-subtitle">Panel de {usuario?.rol}</p>

        <div className="menu-grid">
          {menuOptions.map((option, index) => (
            <div
              key={index}
              className="menu-card"
              onClick={() => navigate(option.path)}
            >
              <h2>{option.title}</h2>
              <p>{option.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
