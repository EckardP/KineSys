import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap'

export default function Navbar() {
  return (
    <BsNavbar bg="dark" variant="dark" expand="lg">  
      <Container>
        <BsNavbar.Brand as={Link} to="/">KineSys</BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/Home">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/therapists">Terapeutas</Nav.Link>
            <Nav.Link as={Link} to="/pacientes">Pacientes</Nav.Link>
            <Nav.Link as={Link} to="/treatments">Terapias</Nav.Link>
            <Nav.Link as={Link} to="/agenda">Agenda</Nav.Link>
            <Nav.Link as={Link} to="/gestionadmin">Admin</Nav.Link>
            
            
          </Nav>
        </BsNavbar.Collapse>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/iniciosesion" aria-label="Iniciar Sesion">Iniciar Sesión
          <img
                src="src/assets/users_theuser_6177.png"        
                alt="Iniciar sesión"
                width="30"
                height="30"
                style={{ objectFit: 'contain' }}
          /> 
          </Nav.Link>
        </Nav>
      </Container>
    </BsNavbar>
  )
}
