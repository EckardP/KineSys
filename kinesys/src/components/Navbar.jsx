import {
  Activity,
  BarChart3,
  Building2,
  CalendarCheck2,
  CalendarDays,
  ClipboardList,
  FileBarChart,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Package,
  Stethoscope,
  UserRound,
  UserRoundCheck,
  Users,
} from "lucide-react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Button, Container, Nav, NavDropdown, Navbar as BsNavbar } from "react-bootstrap"
import { useAuth } from "@/hooks/useAuth"
import { ROLES } from "@/utils/constants"

const iconSize = 16

function getDefaultRoute(usuario, isAuthenticated) {
  if (!isAuthenticated) return "/"
  if (usuario?.rol === ROLES.ADMINISTRADOR) return "/gestionadmin"
  if (usuario?.rol === ROLES.PACIENTE) return "/paciente-dashboard"
  return "/dashboard"
}

function NavIcon({ icon }) {
  const IconComponent = icon
  return <IconComponent size={iconSize} strokeWidth={2.25} aria-hidden="true" />
}

function AppNavLink({ to, icon, children, end = false }) {
  return (
    <Nav.Link as={NavLink} to={to} end={end} className="ks-nav-link">
      <NavIcon icon={icon} />
      <span>{children}</span>
    </Nav.Link>
  )
}

function AppDropdownItem({ to, icon, children }) {
  return (
    <NavDropdown.Item as={NavLink} to={to} className="ks-dropdown-item">
      <NavIcon icon={icon} />
      <span>{children}</span>
    </NavDropdown.Item>
  )
}

function AdminNavigation() {
  return (
    <>
      <AppNavLink to="/gestionadmin" icon={LayoutDashboard}>Panel</AppNavLink>
      <NavDropdown title={<span><NavIcon icon={Users} /> Personas</span>} className="ks-nav-dropdown">
        <AppDropdownItem to="/gestionpaciente/pacientes" icon={UserRound}>Pacientes</AppDropdownItem>
        <AppDropdownItem to="/gestionterapeuta/terapeuta" icon={UserRoundCheck}>Terapeutas</AppDropdownItem>
      </NavDropdown>
      <NavDropdown title={<span><NavIcon icon={CalendarDays} /> Agenda</span>} className="ks-nav-dropdown">
        <AppDropdownItem to="/gestionagenda/agendaadmin" icon={CalendarDays}>Calendario</AppDropdownItem>
        <AppDropdownItem to="/gestioncita/citas" icon={CalendarCheck2}>Citas</AppDropdownItem>
      </NavDropdown>
      <NavDropdown title={<span><NavIcon icon={Stethoscope} /> Clínica</span>} className="ks-nav-dropdown">
        <AppDropdownItem to="/gestiontratamiento/tratamientos" icon={Stethoscope}>Tratamientos</AppDropdownItem>
        <AppDropdownItem to="/gestionservicio/servicios" icon={ClipboardList}>Servicios</AppDropdownItem>
        <AppDropdownItem to="/gestionequipo/equipos" icon={Package}>Equipos</AppDropdownItem>
        <AppDropdownItem to="/gestionsala/salas" icon={Building2}>Salas</AppDropdownItem>
      </NavDropdown>
      <AppNavLink to="/gestionreporte/reportes" icon={FileBarChart}>Reportes</AppNavLink>
    </>
  )
}

function TherapistNavigation() {
  return (
    <>
      <AppNavLink to="/dashboard" icon={LayoutDashboard}>Panel</AppNavLink>
      <AppNavLink to="/pacientes" icon={Users}>Pacientes</AppNavLink>
      <AppNavLink to="/gestionagenda/agendaadmin" icon={CalendarDays}>Agenda</AppNavLink>
      <AppNavLink to="/gestioncita/citas" icon={CalendarCheck2}>Citas</AppNavLink>
    </>
  )
}

function PatientNavigation() {
  return (
    <>
      <AppNavLink to="/paciente-dashboard" icon={Home}>Inicio</AppNavLink>
      <AppNavLink to="/gestioncita/citas" icon={CalendarCheck2}>Mis citas</AppNavLink>
      <AppNavLink to="/agenda" icon={CalendarDays}>Agendar</AppNavLink>
    </>
  )
}

export default function Navbar() {
  const { isAuthenticated, usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const nombreUsuario = [usuario?.nombre, usuario?.apellidos].filter(Boolean).join(" ") || "Usuario"
  const defaultRoute = getDefaultRoute(usuario, isAuthenticated)

  return (
    <BsNavbar expand="lg" sticky="top" className="ks-navbar">
      <Container fluid="xl">
        <BsNavbar.Brand as={Link} to={defaultRoute} className="ks-brand">
          <span className="ks-brand-mark" aria-hidden="true">
            <Activity size={20} strokeWidth={2.4} />
          </span>
          KineSys
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="main-navbar" />
        <BsNavbar.Collapse id="main-navbar">
          <Nav className="ks-primary-nav me-auto">
            {isAuthenticated ? (
              <>
                {usuario?.rol === ROLES.ADMINISTRADOR && <AdminNavigation />}
                {usuario?.rol === ROLES.TERAPEUTA && <TherapistNavigation />}
                {usuario?.rol === ROLES.PACIENTE && <PatientNavigation />}
              </>
            ) : (
              <AppNavLink to="/" icon={Home} end>Inicio</AppNavLink>
            )}
          </Nav>

          <Nav className="ms-auto align-items-lg-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="ks-user-chip">
                  <span>{nombreUsuario}</span>
                  <span>{usuario?.rol}</span>
                </span>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  <LogOut size={16} />
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Button as={Link} to="/login" variant="light" size="sm">
                <LogIn size={16} />
                Iniciar sesión
              </Button>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  )
}
