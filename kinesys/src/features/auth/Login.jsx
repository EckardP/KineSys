import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Eye,
  EyeOff,
  LineChart,
  Loader2,
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

const highlights = [
  {
    icon: BarChart3,
    title: "Gestión integral",
    text: "Pacientes, terapeutas, tratamientos y citas en una sola operación.",
  },
  {
    icon: CalendarDays,
    title: "Agenda clínica",
    text: "Disponibilidad, reservas y control de sesiones con trazabilidad.",
  },
  {
    icon: LineChart,
    title: "Indicadores claros",
    text: "Reportes para evaluar ocupación, asistencia y desempeño.",
  },
]

export default function Login() {
  const [usuario, setUsuario] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)
  const [mostrarContrasena, setMostrarContrasena] = useState(false)

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!usuario.trim() || !contrasena.trim()) {
      return
    }

    setCargando(true)

    try {
      const datosUsuario = await login(usuario, contrasena)

      if (datosUsuario.rol === "Administrador") {
        navigate("/AdminHome")
      } else if (datosUsuario.rol === "Terapeuta") {
        navigate("/dashboard")
      } else if (datosUsuario.rol === "Paciente") {
        navigate("/paciente-dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (err) {
      setError(err.message || "Error al iniciar sesión")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-shell">
      <button type="button" onClick={() => navigate("/")} className="login-back">
        <ArrowLeft size={18} />
        Volver al inicio
      </button>

      <section className="login-panel" aria-label="Acceso a KineSys">
        <aside className="login-story">
          <div>
            <p className="login-eyebrow">Clínica de fisioterapia</p>
            <h1>KineSys</h1>
            <p className="login-lead">Gestión sobria, rápida y segura para equipos clínicos.</p>
          </div>

          <div className="login-highlights">
            {highlights.map((highlight) => {
              const FeatureIcon = highlight.icon

              return (
              <div className="login-highlight" key={highlight.title}>
                <span className="login-highlight-icon">
                  <FeatureIcon size={21} />
                </span>
                <span>
                  <strong>{highlight.title}</strong>
                  <small>{highlight.text}</small>
                </span>
              </div>
              )
            })}
          </div>
        </aside>

        <div className="login-form-wrap">
          <div className="login-form-header">
            <p className="login-eyebrow">Acceso seguro</p>
            <h2>Bienvenido</h2>
            <p>Ingresa tus credenciales para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" aria-label="Formulario de inicio de sesión">
            <div className="login-field">
              <label htmlFor="usuario">Usuario</label>
              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Usuario"
                required
                disabled={cargando}
                autoComplete="username"
              />
            </div>

            <div className="login-field">
              <label htmlFor="contrasena">Contraseña</label>
              <div className="login-password">
                <input
                  id="contrasena"
                  type={mostrarContrasena ? "text" : "password"}
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="Contraseña"
                  required
                  disabled={cargando}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                  tabIndex={-1}
                >
                  {mostrarContrasena ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={cargando} aria-label="Ingresar" className="login-submit">
              {cargando ? (
                <>
                  <Loader2 size={18} className="login-spinner" />
                  Iniciando sesión
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>

          <p className="login-help">
            ¿Problemas para acceder? <button type="button">Contacta al administrador</button>
          </p>
        </div>
      </section>
    </div>
  )
}
