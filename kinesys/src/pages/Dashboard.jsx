
import { useContext, useEffect, useState, useRef } from "react"
import QuickStats from "./dashboard/QuickStats"
import UpcomingAppointments from "./dashboard/UpcomingAppointments"
import RecentPatients from "./dashboard/RecentPatients"
import { AuthContext } from "@/context/AuthContext"
import { createConnection, startConnection } from "@/services/SignalRService"

export default function Dashboard() {
  const { usuario } = useContext(AuthContext)

  const connectionRef = useRef(null)
  const welcomedRef = useRef(false)
  const handlersRegisteredRef = useRef(false)
  const [notificaciones, setNotificaciones] = useState([])

  const displayName =
    usuario?.nombreCompleto || usuario?.nombre || usuario?.nombres || usuario?.usuario || usuario?.email || "Terapeuta"

  const userIdForSignalR = usuario?.id || usuario?.usuario || usuario?.email || null

  useEffect(() => {
    if (!usuario || !userIdForSignalR) return

    const existing = connectionRef.current
    if (existing && existing.state !== undefined && existing.state !== 0) {
      if (!handlersRegisteredRef.current) {
        registerHandlers(existing)
        handlersRegisteredRef.current = true
      }
      return
    }

    const setupConnection = async () => {
      try {
        const conn = createConnection(userIdForSignalR)
        connectionRef.current = conn

        const connected = await startConnection(conn)
        if (!connected) return

        if (!welcomedRef.current) {
          setNotificaciones((prev) =>
            [
              {
                id: `bienvenida-${Date.now()}`,
                tipo: "info",
                texto: `¡Bienvenido ${displayName}! Estás conectado a las notificaciones en tiempo real.`,
                fecha: new Date(),
              },
              ...prev,
            ].slice(0, 50),
          )
          welcomedRef.current = true
        }

        registerHandlers(conn)
        handlersRegisteredRef.current = true
      } catch (err) {
        console.error("Error en setupConnection:", err)
      }
    }

    function registerHandlers(conn) {
      conn.off("Notificacion")
      conn.off("CitaAsignada")
      conn.off("Error")

      conn.on("Notificacion", (mensaje) => {
        const nuevaNotif = {
          id: `notif-${Date.now()}-${Math.random()}`,
          tipo: "info",
          texto: mensaje,
          fecha: new Date(),
        }
        setNotificaciones((prev) => [...prev, nuevaNotif].slice(-50))
      })

      conn.on("CitaAsignada", (cita) => {
        const nuevaNotif = {
          id: `cita-${Date.now()}-${Math.random()}`,
          tipo: "cita",
          texto: `Nueva cita programada: ${cita}`,
          fecha: new Date(),
        }
        setNotificaciones((prev) => [...prev, nuevaNotif].slice(-50))
      })

      conn.on("Error", (error) => {
        const nuevaNotif = {
          id: `error-${Date.now()}-${Math.random()}`,
          tipo: "error",
          texto: String(error),
          fecha: new Date(),
        }
        setNotificaciones((prev) => [...prev, nuevaNotif].slice(-50))
      })

      conn.onclose(() => {
        handlersRegisteredRef.current = false
      })
    }

    setupConnection()

    const intervalo = setInterval(() => {
      setNotificaciones((prev) => {
        const ahora = Date.now()
        const MAX_AGE_MS = 5 * 60 * 1000
        return prev.filter((n) => {
          const fecha = n.fecha instanceof Date ? n.fecha.getTime() : new Date(n.fecha).getTime()
          return ahora - fecha < MAX_AGE_MS
        })
      })
    }, 30000)

    return () => {
      clearInterval(intervalo)
      const conn = connectionRef.current
      if (conn) {
        try {
          conn.off("Notificacion")
          conn.off("CitaAsignada")
          conn.off("Error")
        } catch (e) {
          // Ignorar errores al limpiar
        }
      }
    }
  }, [usuario, userIdForSignalR, displayName])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          {" "}
          Bienvenido al Sistema de Gestión de Fisioterapia
          {usuario?.nombreCompleto && `, Dr. ${usuario.nombreCompleto}`}
        </p>
      </div>

      {notificaciones.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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

      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingAppointments />
        </div>
        <div>
          <RecentPatients />
        </div>
      </div>
    </div>
  )
}
