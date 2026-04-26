
// src/pages/GestionAdmin/GestionAgenda/AgendaAdmin.jsx
import { useEffect, useState, useMemo } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { listarCitas } from "../../../services/citasService"
import { listarTerapeutas } from "../../../services/terapeutasService"
import { listarPacientes } from "../../../services/pacientesService"
import { listarDisponibilidades } from "../../../services/disponibilidadTerapeutaService"
import { CalendarIcon, User, Clock, MapPin } from "lucide-react"

// Función para calcular la fecha basada en el día de la semana (definida ANTES del componente)
const calcularFechaDesdeDiaSemana = (diaSemana) => {
  const dias = {
    'Lunes': 1,
    'Martes': 2,
    'Miércoles': 3,
    'Miercoles': 3,
    'Jueves': 4,
    'Viernes': 5,
    'Sábado': 6,
    'Sabado': 6,
    'Domingo': 0
  }
  
  const hoy = new Date()
  const diaHoy = hoy.getDay()
  const diaObjetivo = dias[diaSemana]
  
  let diferenciaDias = diaObjetivo - diaHoy
  if (diferenciaDias < 0) {
    diferenciaDias += 7
  }
  
  const fechaObjetivo = new Date(hoy)
  fechaObjetivo.setDate(hoy.getDate() + diferenciaDias)
  
  return fechaObjetivo
}

// Función para combinar fecha y hora (TimeSpan)
const combinarFechaYHora = (fecha, timeSpan) => {
  const nuevaFecha = new Date(fecha)
  if (typeof timeSpan === 'string') {
    const [hours, minutes, seconds] = timeSpan.split(':').map(Number)
    nuevaFecha.setHours(hours, minutes, seconds || 0, 0)
  }
  return nuevaFecha.toISOString()
}

const AgendaAdmin = () => {
  const [disponibilidades, setDisponibilidades] = useState([])
  const [citas, setCitas] = useState([])
  const [terapeutas, setTerapeutas] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [filtroTerapeuta, setFiltroTerapeuta] = useState("todos")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function cargarDatos() {
      try {
        setLoading(true)
        const [citasRes, terapeutasRes, pacientesRes, disponibilidadesRes] = await Promise.all([
          listarCitas(),
          listarTerapeutas(),
          listarPacientes(),
          listarDisponibilidades(),
        ])
        setCitas(citasRes || [])
        setTerapeutas(terapeutasRes || [])
        setPacientes(pacientesRes || [])
        setDisponibilidades(disponibilidadesRes || [])
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
    // Filtrar solo las disponibilidades que están ocupadas (con idCita)
    const disponibilidadesOcupadas = disponibilidades.filter(
      disp => disp.idCita !== null && disp.idCita !== 0
    )

    let filtradas = disponibilidadesOcupadas
    if (filtroTerapeuta !== "todos") {
      filtradas = disponibilidadesOcupadas.filter(
        (disp) => disp.idTerapeuta === Number(filtroTerapeuta)
      )
    }

    return filtradas.map((disp) => {
      // Buscar la cita asociada a esta disponibilidad
      const citaAsociada = citas.find(c => c.idCita === disp.idCita)
      const terapeuta = terapeutas.find((t) => t.id === disp.idTerapeuta)
      const paciente = citaAsociada 
        ? pacientes.find((p) => p.id === citaAsociada.idPaciente)
        : null

      // Determinar color basado en el estado de la cita
      const colorMap = {
        programada: "#3b82f6",
        confirmada: "#3b82f6",
        completada: "#10b981",
        cancelada: "#ef4444",
        inasistencia: "#f59e0b",
        pendiente: "#6b7280",
      }

      const estado = citaAsociada?.estado || "programada"
      const backgroundColor = colorMap[estado.toLowerCase()] || "#6b7280"

      // Crear fecha/hora para el calendario
      const fechaBase = calcularFechaDesdeDiaSemana(disp.diaSemana)
      const startDateTime = combinarFechaYHora(fechaBase, disp.horaInicio)
      const endDateTime = combinarFechaYHora(fechaBase, disp.horaFin)

      return {
        id: `disp-${disp.idDisponibilidad}`,
        title: `${paciente?.nombres || "Paciente"} - ${terapeuta?.nombres || "Terapeuta"}`,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
        textColor: "white",
        extendedProps: { 
          estado: estado,
          paciente,
          terapeuta,
          disponibilidad: disp,
          cita: citaAsociada,
          tipoAmbiente: disp.tipoAmbiente
        },
      }
    })
  }, [disponibilidades, citas, terapeutas, pacientes, filtroTerapeuta])

  const handleEventClick = (info) => {
    const { paciente, terapeuta, estado, cita, tipoAmbiente } = info.event.extendedProps
    
    const fechaInicio = new Date(info.event.start).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    const fechaFin = new Date(info.event.end).toLocaleString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })

    const mensaje = `
Cita #${cita?.idCita || "N/A"}
👤 Paciente: ${paciente?.nombres || "N/A"} ${paciente?.apellidos || ""}
👨‍⚕️ Terapeuta: ${terapeuta?.nombres || "N/A"} ${terapeuta?.apellidos || ""}
📅 Fecha: ${fechaInicio} - ${fechaFin}
🏥 Ambiente: ${tipoAmbiente || "No especificado"}
📊 Estado: ${estado}
${cita?.motivo ? `📝 Motivo: ${cita.motivo}` : ''}
${cita?.tipoAtencion ? `🎯 Tipo: ${cita.tipoAtencion}` : ''}
    `.trim()

    alert(mensaje)
  }

  // Función para formatear TimeSpan a hora legible
  const _formatTimeSpan = (timeSpan) => {
    if (typeof timeSpan === 'string') {
      return timeSpan.substring(0, 5) // Convierte "08:00:00" a "08:00"
    }
    return timeSpan
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <CalendarIcon className="w-10 h-10 text-emerald-600" />
            Agenda por Disponibilidades
          </h1>
          <p className="text-gray-600 text-lg">
            Visualiza las disponibilidades ocupadas de los terapeutas (con citas asignadas)
          </p>
          <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Mostrando {eventos.length} horarios ocupados</span>
          </div>
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
                        {t.nombres} {t.apellidos}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="text-gray-700">Programada/Confirmada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-gray-700">Completada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="text-gray-700">Cancelada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-700">Inasistencia</span>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="font-semibold text-blue-800">Total Ocupados</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {disponibilidades.filter(d => d.idCita !== null && d.idCita !== 0).length}
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="font-semibold text-green-800">Disponibles</div>
                  <div className="text-2xl font-bold text-green-600">
                    {disponibilidades.filter(d => d.idCita === null || d.idCita === 0).length}
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="font-semibold text-purple-800">Total Terapeutas</div>
                  <div className="text-2xl font-bold text-purple-600">{terapeutas.length}</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="font-semibold text-orange-800">Filtrados</div>
                  <div className="text-2xl font-bold text-orange-600">{eventos.length}</div>
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
                eventTimeFormat={{
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }}
              />
            </div>

            {/* Lista de disponibilidades ocupadas (como respaldo) */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Lista de Horarios Ocupados ({eventos.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {eventos.length > 0 ? (
                  eventos.map((evento, index) => {
                    const { paciente, terapeuta, estado, tipoAmbiente } = evento.extendedProps
                    const fecha = new Date(evento.start).toLocaleDateString("es-ES", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                    const horaInicio = new Date(evento.start).toLocaleTimeString("es-ES", {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                    const horaFin = new Date(evento.end).toLocaleTimeString("es-ES", {
                      hour: '2-digit',
                      minute: '2-digit'
                    })

                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: evento.backgroundColor }}></div>
                              <h4 className="font-semibold text-gray-900">
                                {paciente?.nombres || "Paciente"} {paciente?.apellidos || ""}
                              </h4>
                              <span className="text-sm text-gray-500">con</span>
                              <h4 className="font-semibold text-gray-900">
                                {terapeuta?.nombres || "Terapeuta"} {terapeuta?.apellidos || ""}
                              </h4>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{fecha}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{horaInicio} - {horaFin}</span>
                              </div>
                              {tipoAmbiente && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span className="capitalize">{tipoAmbiente.toLowerCase()}</span>
                                </div>
                              )}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                estado === 'completada' ? 'bg-green-100 text-green-800' :
                                estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                                estado === 'inasistencia' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {estado}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay horarios ocupados para mostrar
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AgendaAdmin
