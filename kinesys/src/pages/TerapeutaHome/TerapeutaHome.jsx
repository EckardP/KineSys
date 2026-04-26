import { useState, useEffect, useRef } from "react"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useAuth } from "@/hooks/useAuth"
import { ROLES } from "@/utils/constants"
import { createConnection, startConnection, stopConnection } from "@/services/SignalRService"
import Navigation from "./components/Navigation"
import Dashboard from "./components/Dashboard"
import PatientList from "./components/patients/PatientList"
import AppointmentList from "./components/appointments/AppointmentList"
import ClinicalHistoryList from "./components/histories/ClinicalHistoryList"
import InvoiceList from "./components/billing/InvoiceList"
import AuditDashboard from "../GestionAdmin/audit/AuditDashboard"
import TratamientosView from "./components/Treatments/TratamientosView"

export default function TerapeutaHome() {
  useRequireAuth([ROLES.TERAPEUTA])
  const { usuario } = useAuth()

  const [currentPage, setCurrentPage] = useState("dashboard")
  const [notificaciones, setNotificaciones] = useState([])

  const connectionRef = useRef(null)
  const welcomedRef = useRef(false)

  // Nombre visible para bienvenida
  const displayName =
    usuario?.nombre && usuario?.apellidos
      ? `${usuario.nombre} ${usuario.apellidos}`
      : usuario?.nombre ||
        usuario?.nombres ||
        usuario?.usuario ||
        usuario?.email ||
        "Usuario"

  // ID seguro para SignalR
  const userIdForSignalR =
    usuario?.id ||
    usuario?.usuario ||
    usuario?.email ||
    null

  useEffect(() => {
    if (!usuario) return
    if (!userIdForSignalR) {
      console.error("[Terapeuta] No se pudo determinar userId para SignalR", usuario)
      return
    }

    // Reutiliza conexión previa si existe
    const existing = connectionRef.current
    if (existing && existing.state !== undefined && existing.state !== 0) {
      console.log("[Terapeuta] Reutilizando conexión existente")
      existing.off("Notificacion")
      existing.off("CitaAsignada")
      existing.off("Error")
      existing.off("UsuarioConectado")
      registerHandlers(existing)
      return
    }

    const setupConnection = async () => {
      try {
        console.log("[Terapeuta] Creando conexión SignalR...")
        const conn = createConnection(userIdForSignalR)
        connectionRef.current = conn
        const ok = await startConnection(conn)
        if (!ok) {
          console.error("[Terapeuta] No se pudo conectar a SignalR")
          return
        }

        console.log("[Terapeuta] Conectado a SignalR")

        if (!welcomedRef.current) {
          setNotificaciones(prev => [
            {
              id: `bienvenida-${Date.now()}`,
              tipo: "info",
              texto: `¡Bienvenido ${displayName}! Estás conectado a las notificaciones en tiempo real.`,
              fecha: new Date(),
            },
            ...prev,
          ])
          welcomedRef.current = true
        }

        conn.off("Notificacion")
        conn.off("CitaAsignada")
        conn.off("UsuarioConectado")
        conn.off("Error")
        registerHandlers(conn)

      } catch (err) {
        console.error("[Terapeuta] Error iniciando SignalR:", err)
      }
    }

    function registerHandlers(conn) {
      conn.on("Notificacion", (msg) => {
        pushNotif("info", msg)
      })

      conn.on("CitaAsignada", (msg) => {
        pushNotif("cita", `Nueva cita programada: ${msg}`)
      })

      conn.on("UsuarioConectado", (usuarioConectado, rol) => {
        pushNotif("info", `${usuarioConectado} (${rol}) ha iniciado sesión.`)
      })

      conn.on("Error", (error) => {
        pushNotif("error", String(error))
      })

      conn.onclose(() => console.log("[Terapeuta] Conexión cerrada"))
    }

    // Generador de notificaciones consistente con PacienteDashboard
    function pushNotif(tipo, texto) {
      const nueva = {
        id: `${tipo}-${Date.now()}-${Math.random()}`,
        tipo,
        texto,
        fecha: new Date(),
      }
      setNotificaciones(prev => [...prev, nueva].slice(-50))
    }

    setupConnection()

    // Limpieza de notificaciones antiguas cada 30s
    const cleanup = setInterval(() => {
      const now = Date.now()
      const MAX = 5 * 60 * 1000
      setNotificaciones(prev =>
        prev.filter(n => now - new Date(n.fecha).getTime() < MAX)
      )
    }, 30000)

    return () => {
      clearInterval(cleanup)
      const conn = connectionRef.current
      if (conn) {
        conn.off("Notificacion")
        conn.off("CitaAsignada")
        conn.off("UsuarioConectado")
        conn.off("Error")
        stopConnection(conn)
      }
    }
  }, [usuario])

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="ml-64 p-6">

        {/* Notificaciones como PacienteDashboard */}
        {notificaciones.length > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Notificaciones recientes</h3>
            <ul className="space-y-2">
              {notificaciones.slice(-5).map((n) => (
                <li key={n.id} className="text-sm text-blue-800 flex items-start">
                  <span className="mr-2">
                    {n.tipo === "cita" ? "📅" : n.tipo === "error" ? "⚠️" : "🔔"}
                  </span>
                  <span>{n.texto}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "pacientes" && <PatientList />}
        {currentPage === "citas" && <AppointmentList />}
        {currentPage === "historias" && <ClinicalHistoryList />}
        {currentPage === "facturacion" && <InvoiceList />}
        {currentPage === "auditoria" && <AuditDashboard />}
        {currentPage === "tratamientos" && <TratamientosView />}

      </main>
    </div>
  )
}
