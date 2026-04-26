
import { useContext, useEffect, useRef, useState } from "react"
import { useRequireAuth } from "../../hooks/useRequireAuth"
import { AuthContext } from "../../context/AuthContext"
import { createConnection, startConnection } from "../../services/SignalRService"
import Navigation from "./components/Navigation"
import StatisticsCard from "./components/StatisticsCard"
import UpcomingAppointments from "./components/UpcomingAppointments"
import MedicalHistory from "./components/MedicalHistory"
import "./PacienteDashboard.css"

export default function PacienteDashboard() {
  useRequireAuth()
  const { usuario } = useContext(AuthContext)

  // refs para evitar recrear conexiones y para evitar bienvenida duplicada
  const connectionRef = useRef(null)
  const welcomedRef = useRef(false)

  const [notificaciones, setNotificaciones] = useState([])

  // Determinar displayName y userId de forma robusta (evita undefined)
  const displayName = usuario?.nombre
    || usuario?.nombreCompleto
    || usuario?.nombres
    || usuario?.usuario
    || usuario?.email
    || "Usuario"

  const userIdForSignalR = usuario?.id || usuario?.usuario || usuario?.email || null

  useEffect(() => {
    if (!usuario) return

    if (!userIdForSignalR) {
      console.error("[v0] PacienteDashboard - No se pudo determinar userId para SignalR", usuario)
      return
    }

    // Si ya existe una conexión y no está desconectada, la reutilizamos
    const existing = connectionRef.current
    if (existing && existing.state !== undefined && existing.state !== 0 /* Disconnected */) {
      console.log("[v0] PacienteDashboard - Reutilizando conexión existente")
      // registramos handlers (después nos aseguramos de limpiar duplicados)
      // pero preferimos limpiar handlers previos aquí antes de re-registrar
      existing.off("Notificacion")
      existing.off("CitaAsignada")
      existing.off("Error")
      registerHandlers(existing)
      return
    }

    const setupConnection = async () => {
      try {
        console.log("[v0] PacienteDashboard - Iniciando conexión SignalR... userId:", userIdForSignalR)
        const conn = createConnection(userIdForSignalR)
        connectionRef.current = conn
        const connected = await startConnection(conn)
        if (!connected) {
          console.error("[v0] PacienteDashboard - No se pudo conectar a SignalR")
          return
        }

        console.log("[v0] PacienteDashboard - SignalR conectado exitosamente")

        // Mensaje de bienvenida solo una vez por sesión de componente/usuario
        if (!welcomedRef.current) {
          setNotificaciones(prev => [
            {
              id: `bienvenida-${Date.now()}`,
              tipo: "info",
              texto: `¡Bienvenido ${displayName}! Estás conectado a las notificaciones en tiempo real.`,
              fecha: new Date(),
            },
            ...prev,
          ].slice(0, 50)) // guardamos máximo 50 en memoria
          welcomedRef.current = true
        }

        // Nos aseguramos de limpiar handlers antiguos antes de re-registrar
        conn.off("Notificacion")
        conn.off("CitaAsignada")
        conn.off("Error")

        registerHandlers(conn)
      } catch (err) {
        console.error("[v0] PacienteDashboard - Error en setupConnection:", err)
      }
    }

    function registerHandlers(conn) {
      conn.on("Notificacion", (mensaje) => {
        const nuevaNotif = {
          id: `notif-${Date.now()}-${Math.random()}`,
          tipo: "info",
          texto: mensaje,
          fecha: new Date(),
        }
        setNotificaciones(prev => {
          const nueva = [...prev, nuevaNotif].slice(-50) // limitar memoria: quedan las 50 más recientes
          return nueva
        })
      })

      conn.on("CitaAsignada", (cita) => {
        const nuevaNotif = {
          id: `cita-${Date.now()}-${Math.random()}`,
          tipo: "cita",
          texto: `Nueva cita programada: ${cita}`,
          fecha: new Date(),
        }
        setNotificaciones(prev => {
          const nueva = [...prev, nuevaNotif].slice(-50)
          return nueva
        })
      })

      conn.on("Error", (error) => {
        const nuevaNotif = {
          id: `error-${Date.now()}-${Math.random()}`,
          tipo: "error",
          texto: String(error),
          fecha: new Date(),
        }
        setNotificaciones(prev => {
          const nueva = [...prev, nuevaNotif].slice(-50)
          return nueva
        })
      })

      conn.onclose(() => {
        console.log("[v0] PacienteDashboard - Conexión SignalR cerrada")
      })
    }

    setupConnection()

    // Intervalo para limpiar notificaciones antiguas (evita acumulación)
    const intervalo = setInterval(() => {
      setNotificaciones(prev => {
        const ahora = Date.now()
        const MAX_AGE_MS = 5 * 60 * 1000 // 5 minutos
        return prev.filter(n => {
          const fecha = n.fecha instanceof Date ? n.fecha.getTime() : new Date(n.fecha).getTime()
          return (ahora - fecha) < MAX_AGE_MS
        })
      })
    }, 30000)

    return () => {
      // limpieza de efectos: no forzamos desconexión global (podrías hacerlo en logout),
      // pero removemos handlers registrados por este componente para evitar duplicados si se monta otra vez.
      clearInterval(intervalo)
      const conn = connectionRef.current
      if (conn) {
        try {
          conn.off("Notificacion")
          conn.off("CitaAsignada")
          conn.off("Error")
        } catch (e) {
          // no hacemos mucho si falla
        }
      }
      // Si preferís desconectar la socket al desmontar el dashboard, descomenta:
      // if (conn) stopConnection(conn).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]) // dependemos del usuario

  return (
    <div className="paciente-dashboard">
      <Navigation usuario={usuario} />

      <main className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Bienvenido, {displayName}</h1>
            <p className="welcome-subtitle">Tu panel de control de citas y seguimiento médico</p>
          </div>
        </div>

        {notificaciones.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Notificaciones recientes</h4>
            <ul className="space-y-2">
              {notificaciones.slice(-5).map((notif) => (
                <li key={notif.id} className="text-sm text-blue-800 flex items-start">
                  <span className="mr-2">{notif.tipo === "cita" ? "📅" : notif.tipo === "error" ? "⚠️" : "🔔"}</span>
                  <span>{notif.texto}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="statistics-section">
          <StatisticsCard />
        </div>

        {/* Main Content Grid */}
        <div className="main-content-grid">
          <div className="appointments-section">
            <UpcomingAppointments />
          </div>
          <div className="history-section">
            <MedicalHistory />
          </div>
        </div>
      </main>
    </div>
  )
}
