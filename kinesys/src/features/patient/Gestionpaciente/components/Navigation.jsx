
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "@/context/AuthContext"

export default function Navigation({ usuario }) {
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="navbar-paciente">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>KineSys</h2>
          <span className="patient-badge">Paciente</span>
        </div>

        <div className="navbar-content">
          <span className="user-info">{usuario?.nombreCompleto || usuario?.nombre}</span>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  )
}
