"use client"

// src/pages/GestionAdmin/GestionAgenda/AgendaAdmin.jsx
import { useEffect, useState, useMemo } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { listarCitas } from "../../../services/citasService"
import { listarTerapeutas } from "../../../services/terapeutasService"
import { listarPacientes } from "../../../services/pacientesService"
import { CalendarIcon, User } from "lucide-react"

const AgendaAdmin = () => {
  const [citas, setCitas] = useState([])
  const [terapeutas, setTerapeutas] = useState([])
  const [pacientes, setPacientes] = useState([]) // ✅ ahora dentro del componente
  const [filtroTerapeuta, setFiltroTerapeuta] = useState("todos")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function cargarDatos() {
      try {
        setLoading(true)
        const [citasRes, terapeutasRes, pacientesRes] = await Promise.all([
          listarCitas(),
          listarTerapeutas(),
          listarPacientes(),
        ])
        setCitas(citasRes || [])
        setTerapeutas(terapeutasRes || [])
        setPacientes(pacientesRes || [])
      } catch (err) {
        setError("Error al cargar la agenda")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    cargarDatos()
  }, [])

  const eventos = useMemo(() => {
    let filtradas = citas
    if (filtroTerapeuta !== "todos") {
      filtradas = citas.filter((c) => c.idTerapeuta === Number(filtroTerapeuta))
    }

    return filtradas.map((cita) => {
      const terapeuta = terapeutas.find((t) => t.id === cita.idTerapeuta)
      const paciente = pacientes.find((p) => p.id === cita.idPaciente) // ✅ busca el paciente por ID

      const colorMap = {
        programada: "#3b82f6",
        completada: "#10b981",
        cancelada: "#ef4444",
        inasistencia: "#f59e0b",
      }

      return {
        id: cita.idCita, // ✅ campo correcto
        title: `${paciente?.nombres || "Paciente"} - ${terapeuta?.nombres || "Terapeuta"}`,
        start: cita.horaInicioReal, // ✅ propiedad del backend
        end: cita.horaFinReal, // ✅ propiedad del backend
        backgroundColor: colorMap[cita.estado] || "#6b7280",
        borderColor: colorMap[cita.estado] || "#6b7280",
        textColor: "white",
        extendedProps: { estado: cita.estado, paciente, terapeuta },
      }
    })
  }, [citas, terapeutas, pacientes, filtroTerapeuta])

  const handleEventClick = (info) => {
    const { paciente, terapeuta, estado } = info.event.extendedProps
    const fecha = new Date(info.event.start).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    alert(
      `Cita #${info.event.id}\n` +
        `Paciente: ${paciente?.nombres || "N/A"}\n` +
        `Terapeuta: ${terapeuta?.nombres || "N/A"}\n` +
        `Fecha: ${fecha}\n` +
        `Estado: ${estado}`,
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <CalendarIcon className="w-10 h-10 text-emerald-600" />
            Agenda General
          </h1>
          <p className="text-gray-600 text-lg">Visualiza todas las citas programadas de los terapeutas</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando agenda...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-800">{error}</div>
        ) : (
          <>
            {/* Filtros y Leyenda */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex items-center gap-3 flex-1">
                  <User className="w-5 h-5 text-gray-500" />
                  <select
                    value={filtroTerapeuta}
                    onChange={(e) => setFiltroTerapeuta(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    <option value="todos">Todos los terapeutas</option>
                    {terapeutas.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombres}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="text-gray-700">Programada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-gray-700">Completada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="text-gray-700">Cancelada</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendario */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={eventos}
                eventClick={handleEventClick}
                height="700px"
                slotMinTime="06:00:00"
                slotMaxTime="20:00:00"
                locale="es"
                buttonText={{
                  today: "Hoy",
                  month: "Mes",
                  week: "Semana",
                  day: "Día",
                }}
                slotLabelFormat={{
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AgendaAdmin
