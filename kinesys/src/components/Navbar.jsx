import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

export default function Navbar() {
  const { isAuthenticated, usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BsNavbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <BsNavbar.Brand as={Link} to={isAuthenticated ? "/dashboard" : "/"} className="fw-bold">
          KineSys
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BsNavbar.Collapse id="basic-navbar-nav">
          {isAuthenticated && (
            <Nav className="me-auto">
              {usuario?.rol === ROLES.ADMINISTRADOR && (
                <>
                  <Nav.Link as={Link} to="/gestionadmin">Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/pacientes">Pacientes</Nav.Link>
                  <Nav.Link as={Link} to="/gestionterapeuta/terapeuta">Terapeutas</Nav.Link>
                  <Nav.Link as={Link} to="/gestionagenda/agendaadmin">Agenda</Nav.Link>
                  <Nav.Link as={Link} to="/gestioncita/citas">Citas</Nav.Link>
                  <Nav.Link as={Link} to="/gestionreporte/reportes">Reportes</Nav.Link>
                </>
              )}
              
              {usuario?.rol === ROLES.TERAPEUTA && (
                <>
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/pacientes">Mis Pacientes</Nav.Link>
                  <Nav.Link as={Link} to="/gestionagenda/agendaadmin">Mi Agenda</Nav.Link>
                  <Nav.Link as={Link} to="/gestioncita/citas">Mis Citas</Nav.Link>
                </>
              )}

              {usuario?.rol === ROLES.PACIENTE && (
                <>
                  <Nav.Link as={Link} to="/dashboard">Inicio</Nav.Link>
                  <Nav.Link as={Link} to="/gestioncita/citas">Mis Citas</Nav.Link>
                  <Nav.Link as={Link} to="/agenda">Agendar</Nav.Link>
                </>
              )}
            </Nav>
          )}

          <Nav className="ms-auto align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-light me-2">
                  <span className="fw-semibold">{usuario?.nombre} {usuario?.apellidos}</span>
                  <span className="text-muted ms-2">({usuario?.rol})</span>
                </span>
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Button 
                as={Link} 
                to="/login" 
                variant="light" 
                size="sm"
              >
                Iniciar Sesión
              </Button>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
