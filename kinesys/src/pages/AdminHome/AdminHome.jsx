"use client"

// src/pages/AdminHome.jsx

import { Users, CalendarDays, BarChart3, UserPlus, Calendar, Stethoscope, Package } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import MetricCard from "../GestionAdmin/components/Cartas/MetricCard"
import QuickAccessButton from "../GestionAdmin/components/Botones/QuickAccessButton"
import { listarTerapeutas } from "../../services/terapeutasService.js"
import { listarCitas } from "../../services/citasService.js"
import "./AdminDashboard.css"
import { Routes, Route, Navigate } from "react-router-dom"
import AgendaAdmin from "../GestionAdmin/GestionAgenda/AgendaAdmin"
import AppointmentList from "../GestionAdmin/GestionCita/AppointmentList"
import PatientList from "../GestionAdmin/GestionPaciente/PatientList"
import Reportes from "../GestionAdmin/GestionReporte/Reportes"
import TerapeutaForm from "../GestionAdmin/GestionTerapeuta/TerapeutaForm"
import TratamientosList from "../GestionAdmin/GestionTratamiento/TratamientosList"
import { createConnection, startConnection, stopConnection } from "../../services/SignalRService"
import { useAuth } from "../../hooks/useAuth"


import EquiposList from "../GestionAdmin/GestionEquipo/EquiposList" // Nueva importación
import { ClipboardList } from "lucide-react"
import TipoServiciosList from "../GestionAdmin/GestionServicio/TipoServiciosList"
import { Building } from "lucide-react"
import SalasList from "../GestionAdmin/GestionSala/SalasList"
import CitaList from "../GestionAdmin/GestionCita/CitaList"

function AdminDashboard() {
  const [totalTerapeutas, setTotalTerapeutas] = useState(0)
  const [sesionesDia, setSesionesDia] = useState(0)
  const [ocupacionAgenda, setOcupacionAgenda] = useState(0)
  const [notificaciones, setNotificaciones] = useState([])

  const connectionRef = useRef(null)         // referencia a la conexión para evitar recrearla
  const welcomedRef = useRef(false)          // evita mensaje de bienvenida duplicado
  const { usuario } = useAuth()

  // Determinar displayName y userId de forma robusta
  const displayName = usuario?.nombre
    || usuario?.nombreCompleto
    || usuario?.nombres
    || usuario?.usuario
    || usuario?.email
    || "Usuario"

  const userIdForSignalR = usuario?.id || usuario?.usuario || usuario?.email || null

  useEffect(() => {
    // Si no hay usuario o no hay id para SignalR, no conectar
    if (!usuario || !userIdForSignalR) {
      console.log("[v0] AdminHome - Usuario no listo para SignalR:", usuario)
      return
    }

    // Si ya existe una conexión activa y no está desconectada, no crear otra
    if (connectionRef.current && connectionRef.current.state !== undefined && connectionRef.current.state !== 0 /*Disconnected*/) {
      console.log("[v0] AdminHome - Conexión ya existente, reutilizando")
      // Asegurarnos de que handlers no se dupliquen: los registramos/desregistramos abajo
    } else {
      // Crear y arrancar la conexión
      const setupConnection = async () => {
        try {
          console.log("[v0] AdminHome - Iniciando conexión SignalR... userId:", userIdForSignalR)
          const conn = createConnection(userIdForSignalR)
          connectionRef.current = conn

          const connected = await startConnection(conn)
          if (!connected) {
            console.error("[v0] AdminHome - No se pudo conectar a SignalR")
            return
          }

          console.log("[v0] AdminHome - SignalR conectado exitosamente")

          // Bienvenida (solo la primera vez)
          if (!welcomedRef.current) {
            setNotificaciones(prev => [
              {
                tipo: "info",
                texto: `¡Bienvenido ${displayName}! Estás conectado a las notificaciones en tiempo real.`,
                fecha: new Date(),
              },
              ...prev,
            ])
            welcomedRef.current = true
          }

          // Limpieza previa de handlers para evitar duplicados
          conn.off("Notificacion")
          conn.off("CitaAsignada")
          conn.off("Error")

          conn.on("Notificacion", (mensaje) => {
            console.log("[v0] AdminHome - Notificación recibida:", mensaje)
            setNotificaciones(prev => {
              const nueva = [{ tipo: "info", texto: mensaje, fecha: new Date() }, ...prev]
              return nueva.slice(0, 50) // límite en memoria: solo guardar 50 más recientes
            })
          })

          conn.on("CitaAsignada", (cita) => {
            console.log("[v0] AdminHome - Cita asignada:", cita)
            setNotificaciones(prev => {
              const nueva = [{ tipo: "cita", texto: `Nueva cita asignada: ${cita}`, fecha: new Date() }, ...prev]
              return nueva.slice(0, 50)
            })
          })

          conn.on("Error", (error) => {
            console.error("[v0] AdminHome - Error recibido:", error)
            setNotificaciones(prev => {
              const nueva = [{ tipo: "error", texto: String(error), fecha: new Date() }, ...prev]
              return nueva.slice(0, 50)
            })
          })

          conn.onclose(() => {
            console.log("[v0] AdminHome - Conexión SignalR cerrada")
          })
        } catch (err) {
          console.error("[v0] AdminHome - Error en setupConnection:", err)
        }
      }

      setupConnection()
    }

    // cleanup: no param conn; usamos connectionRef
    return () => {
      console.log("[v0] AdminHome - Limpiando efectos SignalR (no necesariamente desconectando si la conexión es global)")
      // Si quieres desconectar aquí, puedes parar la conexión:
      // if (connectionRef.current) stopConnection(connectionRef.current).catch(() => {})
      // En este componente solo desregistramos handlers para evitar duplicados si se monta otra vez
      const conn = connectionRef.current
      if (conn) {
        conn.off("Notificacion")
        conn.off("CitaAsignada")
        conn.off("Error")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]) // solo re-ejecuta si cambia el usuario

  // Limpieza automática de notificaciones antiguas y evitar crecimiento ilimitado
  useEffect(() => {
    const CLEAN_INTERVAL_MS = 5000   // cada 5s
    const MAX_AGE_MS = 60 * 1000     // mantener 60 segundos (ajustable)

    const interval = setInterval(() => {
      setNotificaciones(prev => prev.filter(n => {
        // `n.fecha` puede ser string si proviene de servidor: normalizamos
        const fecha = n.fecha instanceof Date ? n.fecha : new Date(n.fecha)
        return (Date.now() - fecha.getTime()) < MAX_AGE_MS
      }))
    }, CLEAN_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  // Carga métricas (terapeutas, citas)
  useEffect(() => {
    async function cargarDatos() {
      try {
        const [terapeutas, citas] = await Promise.all([listarTerapeutas(), listarCitas()])

        setTotalTerapeutas(terapeutas?.length ?? 0)

        const hoy = new Date().toDateString()
        const sesionesHoy = (citas || []).filter((cita) => {
          const fechaCita = cita.horaInicioReal ? new Date(cita.horaInicioReal).toDateString() : null
          return fechaCita === hoy && cita.estado === "confirmada"
        }).length
        setSesionesDia(sesionesHoy)

        const slotsDisponiblesTotales = (terapeutas?.length ?? 0) * 8
        const ocupacion = slotsDisponiblesTotales > 0 ? Math.round((sesionesHoy / slotsDisponiblesTotales) * 100) : 0
        setOcupacionAgenda(ocupacion)
      } catch (error) {
        console.error("Error al cargar datos del Dashboard:", error)
      }
    }

    cargarDatos()
  }, [])

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-title">Panel del Administrador</h1>

        {notificaciones.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Notificaciones recientes</h4>
            <ul className="space-y-2">
              {notificaciones.slice(0, 5).map((notif, index) => (
                <li key={index} className="text-sm text-blue-800 flex items-start">
                  <span className="mr-2">{notif.tipo === "cita" ? "📅" : notif.tipo === "error" ? "⚠️" : "🔔"}</span>
                  <span>{notif.texto}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Métricas globales */}
        <div className="metrics-section">
          <MetricCard title="Terapeutas Activos" value={totalTerapeutas} icon={<Users size={24} />} />
          <MetricCard title="Sesiones del Día" value={sesionesDia} icon={<CalendarDays size={24} />} />
          <MetricCard title="Ocupación de Agenda" value={`${ocupacionAgenda}%`} icon={<BarChart3 size={24} />} />
        </div>

        {/* Botones DE alta importancia */}
        <div className="quick-access-section">
          <h2 className="section-title">Botones de Alta Importancia</h2>
          <div className="quick-access-buttons">
                   <QuickAccessButton
                      label="Gestionar Citas"
                      path="/gestioncita/citas"
                      icon={<Calendar size={20} />}
                  />
            </div>
          </div>


        {/* Accesos rápidos */}
        <div className="quick-access-section">
          <h2 className="section-title">Accesos Rápidos</h2>
          <div className="quick-access-buttons">

            <QuickAccessButton
              label="Gestionar Citas"
              path="/gestioncita/citas"
              icon={<Calendar size={20} />}
            />


            <QuickAccessButton
              label="Gestionar Pacientes"
              path="/gestionpaciente/pacientes"
              icon={<UserPlus size={20} />}
            />
            
            <QuickAccessButton
              label="Gestionar Terapeutas"
              path="/gestionterapeuta/terapeuta"
              icon={<Users size={20} />}
            />
            <QuickAccessButton label="Ver Agenda" path="/gestionagenda/agendaadmin" icon={<CalendarDays size={20} />} />
            <QuickAccessButton label="Ver Reportes" path="/gestionreporte/reportes" icon={<BarChart3 size={20} />} />

            {/* Nuevo botón para Gestión de Equipos */}
            <QuickAccessButton
              label="Gestionar Equipos"
              path="/gestionequipo/equipos"
              icon={<Package size={20} />}
            />
            {/* Nuevo boton para gestion de tipo de servicios */}
            <QuickAccessButton
              label="Gestionar Servicios"
              path="/gestionservicio/servicios"
              icon={<ClipboardList size={20} />}
            />
            {/* Nuevo boton para gestion de salas */}
            <QuickAccessButton
              label="Gestionar Salas"
              path="/gestionsala/salas"
              icon={<Building size={20} />}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminHome() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />

      <Route path="/gestioncita/citas" element={<CitaList />} />

      <Route path="/gestionterapeuta/terapeuta" element={<TerapeutaForm />} />
      <Route path="/gestionagenda/agendaadmin" element={<AgendaAdmin />} />
      
      <Route path="/gestionpaciente/pacientes" element={<PatientList />} />
      <Route path="/gestionreporte/reportes" element={<Reportes />} />

      <Route path="/gestiontratamiento/tratamientos" element={<TratamientosList />} />
      <Route path="/gestionequipo/equipos" element={<EquiposList />} />
      {/* Nueva ruta para Gestión de Tipo de Servicios */}
      <Route path="/gestionservicio/servicios" element={<TipoServiciosList />} />

      <Route path="/gestionsala/salas" element={<SalasList />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
