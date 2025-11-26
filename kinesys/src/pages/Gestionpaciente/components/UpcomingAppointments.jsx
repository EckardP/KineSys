"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../../context/AuthContext"
import { citasApi } from "../../../api/citasApi"
import AppointmentDetail from "./AppointmentDetail"

export default function UpcomingAppointments() {
  const { usuario } = useContext(AuthContext)
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState("proximas")
  const [selectedCita, setSelectedCita] = useState(null)

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const todasLasCitas = await citasApi.getAll()

        // Filtrar citas del paciente actual
        const citasDelPaciente = todasLasCitas.filter((cita) => cita.pacienteId === usuario?.id)

        // Ordenar por fecha
        citasDelPaciente.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

        setCitas(citasDelPaciente)
      } catch (error) {
        console.error("Error al cargar citas:", error)
      } finally {
        setLoading(false)
      }
    }

    if (usuario?.id) {
      fetchCitas()
    }
  }, [usuario?.id])

  const ahora = new Date()
  const citasProximas = citas.filter((cita) => new Date(cita.fecha) >= ahora)
  const citasHistorico = citas.filter((cita) => new Date(cita.fecha) < ahora)

  const citasAMostrar = filtro === "proximas" ? citasProximas : citasHistorico

  return (
    <div className="appointments-card">
      <div className="card-header">
        <h3>Citas Programadas</h3>
        <div className="filter-tabs">
          <button className={`tab ${filtro === "proximas" ? "active" : ""}`} onClick={() => setFiltro("proximas")}>
            Próximas ({citasProximas.length})
          </button>
          <button className={`tab ${filtro === "historico" ? "active" : ""}`} onClick={() => setFiltro("historico")}>
            Historial ({citasHistorico.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Cargando citas...</p>
        </div>
      ) : citasAMostrar.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">📭</p>
          <p className="empty-text">
            {filtro === "proximas" ? "No tienes citas programadas próximamente" : "No hay citas en el historial"}
          </p>
        </div>
      ) : (
        <div className="appointments-list">
          {citasAMostrar.map((cita) => (
            <div
              key={cita.id}
              className={`appointment-item ${new Date(cita.fecha) < ahora ? "completed" : "upcoming"}`}
              onClick={() => setSelectedCita(cita)}
            >
              <div className="appointment-date">
                <div className="date-circle">
                  {new Date(cita.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                </div>
              </div>

              <div className="appointment-info">
                <h4 className="appointment-title">{cita.tipo || "Cita de Fisioterapia"}</h4>
                <p className="appointment-time">
                  🕐 {new Date(cita.fecha).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p className="appointment-therapist">👨‍⚕️ {cita.terapeutaNombre || "Terapeuta asignado"}</p>
              </div>

              <div className="appointment-status">
                <span className={`status-badge ${new Date(cita.fecha) < ahora ? "completed" : "pending"}`}>
                  {new Date(cita.fecha) < ahora ? "Completada" : "Pendiente"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCita && <AppointmentDetail cita={selectedCita} onClose={() => setSelectedCita(null)} />}
    </div>
  )
}
