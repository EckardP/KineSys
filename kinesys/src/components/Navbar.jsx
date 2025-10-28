// import React from 'react'
// import { Link } from 'react-router-dom'
// import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap'

// export default function Navbar() {
//   return (
//     <BsNavbar bg="dark" variant="dark" expand="lg">  
//       <Container>
//         <BsNavbar.Brand as={Link} to="/">KineSys</BsNavbar.Brand>
//         <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
//         <BsNavbar.Collapse id="basic-navbar-nav">
//           <Nav className="me-auto">
//             <Nav.Link as={Link} to="/Home">Inicio</Nav.Link>
            
//             <Nav.Link as={Link} to="/therapists">Terapeutas</Nav.Link>
//             <Nav.Link as={Link} to="/pacientes">Pacientes</Nav.Link>
//             <Nav.Link as={Link} to="/treatments">Terapias</Nav.Link>
//             <Nav.Link as={Link} to="/agenda">Agenda</Nav.Link>
            
            
//           </Nav>
//         </BsNavbar.Collapse>
//       </Container>
//     </BsNavbar>
//   )
// }

// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importar useNavigate
import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap';
import { checkAuthTemp, getUserRoleTemp, ROLES } from '../utils/auth'; // ¡Importa las funciones temporales!

export default function Navbar() {
  const isAuthenticated = checkAuthTemp(); // Verifica si hay sesión simulada
  const userRole = getUserRoleTemp(); // Obtiene el rol simulado

 

  return (
    <BsNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        {/* Si está autenticado, lleva al dashboard, si no, a la home pública */}
        <BsNavbar.Brand as={Link} to={isAuthenticated ? `/gestionadmin` : "/"}>KineSys</BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BsNavbar.Collapse id="basic-navbar-nav">

          {isAuthenticated && ( // Solo muestra enlaces internos si hay sesión simulada
            <Nav className="me-auto">
              {/* Ejemplo de condicional por rol si lo necesitas */}
              
              {userRole === ROLES.ADMIN && (
                <Nav.Link as={Link} to="/pacientes">Pacientes</Nav.Link>
              )}
              <Nav.Link as={Link} to="/treatments">Terapias</Nav.Link>
              <Nav.Link as={Link} to="/gestionagenda/agendaadmin">Agenda</Nav.Link>
              <Nav.Link as={Link} to="/gestioncita/citas">Citas</Nav.Link>
              {/* Puedes añadir más enlaces y condicionales por rol aquí */}
            </Nav>
          )}

        </BsNavbar.Collapse>

          
      </Container>
    </BsNavbar>
  );
}