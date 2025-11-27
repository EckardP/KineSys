// src/pages/GestionCita/CitaScheduleSelection.jsx
"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, ArrowRight, ArrowLeft, Loader } from "lucide-react"
import { obtenerDisponibilidadPorTerapeuta } from "../../../services/disponibilidadTerapeutaService"

export default function CitaScheduleSelection({ citaData, updateCitaData, onNext, onBack }) {
  const [disponibilidades, setDisponibilidades] = useState([])
  const [horariosDisponibles, setHorariosDisponibles] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedHorario, setSelectedHorario] = useState(null)
  const [tipoAtencion, setTipoAtencion] = useState(citaData.tipoAtencion || "")
  const [motivo, setMotivo] = useState(citaData.motivo || "")

  // Cargar disponibilidades del terapeuta seleccionado
  useEffect(() => {
    if (citaData.idTerapeuta) {
      cargarDisponibilidades()
    }
  }, [citaData.idTerapeuta])

  // Procesar horarios disponibles cuando cambien las disponibilidades
  useEffect(() => {
    if (disponibilidades.length > 0) {
      procesarHorariosDisponibles()
    }
  }, [disponibilidades])

  const cargarDisponibilidades = async () => {
    try {
      setLoading(true)
      const disponibilidadesData = await obtenerDisponibilidadPorTerapeuta(citaData.idTerapeuta)
      
      // Filtrar solo las disponibilidades que están libres (Disponible = true y sin cita asignada)
      const disponibilidadesLibres = disponibilidadesData.filter(
        disp => disp.disponible === true && !disp.idCita
      )
      
      setDisponibilidades(disponibilidadesLibres)
    } catch (error) {
      console.error("Error al cargar disponibilidades:", error)
      setDisponibilidades([])
    } finally {
      setLoading(false)
    }
  }

  const procesarHorariosDisponibles = () => {
    const horarios = []
    
    disponibilidades.forEach(disp => {
      // Convertir TimeSpan a formato legible
      const horaInicio = formatTimeSpan(disp.horaInicio)
      const horaFin = formatTimeSpan(disp.horaFin)
      
      // Calcular fecha basada en el día de la semana
      const fecha = calcularProximaFecha(disp.diaSemana)
      
      horarios.push({
        idDisponibilidad: disp.idDisponibilidad,
        diaSemana: disp.diaSemana,
        fecha: fecha,
        horaInicio: horaInicio,
        horaFin: horaFin,
        horaInicioTimeSpan: disp.horaInicio,
        horaFinTimeSpan: disp.horaFin,
        tipoAmbiente: disp.tipoAmbiente,
        fechaCompleta: `${fecha}T${horaInicio}`
      })
    })
    
    // Ordenar por fecha y hora
    horarios.sort((a, b) => new Date(a.fechaCompleta) - new Date(b.fechaCompleta))
    setHorariosDisponibles(horarios)
  }

  const formatTimeSpan = (timeSpan) => {
    // TimeSpan viene como "08:00:00" - convertir a "08:00"
    if (typeof timeSpan === 'string') {
      return timeSpan.substring(0, 5)
    }
    return timeSpan
  }

  const calcularProximaFecha = (diaSemana) => {
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
    
    return fechaObjetivo.toISOString().split('T')[0]
  }

  const handleSelectHorario = (horario) => {
    setSelectedHorario(horario)
    
    // Crear objeto de fecha/hora completo
    const fechaHora = new Date(horario.fechaCompleta)
    
    updateCitaData({
      fechaHora: fechaHora.toISOString(),
      idDisponibilidad: horario.idDisponibilidad,
      tipoAtencion,
      motivo
    })
  }

  const handleContinue = () => {
    if (!selectedHorario) {
      alert("Por favor selecciona un horario disponible")
      return
    }

    if (!tipoAtencion) {
      alert("Por favor selecciona el tipo de atención")
      return
    }

    onNext()
  }

  const tiposAtencion = [
    "Inicial / valoración",
    "Tratamiento / sesión terapéutica",
    "Seguimiento",
    "Control",
    "Evolución / reevaluación",
    "Alta / cierre de tratamiento",
    "Interconsulta / derivación",
    "Preventiva / bienestar"
  ]

  const getDiaSemanaNombre = (fecha) => {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const date = new Date(fecha)
    return dias[date.getDay()]
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Paso 4: Selecciona horario y tipo de atención
        </h3>
        <p className="text-gray-600">
          Elige un horario disponible del terapeuta y especifica el tipo de atención.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horarios disponibles */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Horarios disponibles del terapeuta
            </label>
            
            {loading ? (
              <div className="text-center py-8">
                <Loader className="animate-spin mx-auto mb-3 text-indigo-600" size={32} />
                <p className="text-gray-600">Cargando horarios disponibles...</p>
              </div>
            ) : horariosDisponibles.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {horariosDisponibles.map((horario, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedHorario?.idDisponibilidad === horario.idDisponibilidad
                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleSelectHorario(horario)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-5 h-5 text-indigo-600" />
                          <div>
                            <h5 className="font-semibold text-gray-900">
                              {getDiaSemanaNombre(horario.fecha)}, {new Date(horario.fecha).toLocaleDateString()}
                            </h5>
                            <p className="text-sm text-gray-600 capitalize">
                              {horario.diaSemana.toLowerCase()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock size={16} />
                            <span>{horario.horaInicio} - {horario.horaFin}</span>
                          </div>
                          
                          {horario.tipoAmbiente && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {horario.tipoAmbiente}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {selectedHorario?.idDisponibilidad === horario.idDisponibilidad && (
                        <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center ml-4">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">
                  {citaData.idTerapeuta 
                    ? "No hay horarios disponibles para este terapeuta en este momento."
                    : "Selecciona un terapeuta para ver sus horarios disponibles."
                  }
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duración estimada
            </label>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duración del servicio</span>
                <span className="font-semibold text-gray-900">
                  {citaData.duracionProgramadaMin} minutos
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tipo de atención y motivo */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de atención
            </label>
            <select
              value={tipoAtencion}
              onChange={(e) => {
                setTipoAtencion(e.target.value)
                updateCitaData({ tipoAtencion: e.target.value })
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Selecciona el tipo de atención</option>
              {tiposAtencion.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de la cita
            </label>
            <textarea
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value)
                updateCitaData({ motivo: e.target.value })
              }}
              rows={4}
              placeholder="Describe el motivo de la cita..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Información del horario seleccionado */}
          {selectedHorario && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Horario seleccionado</h4>
              <div className="space-y-2 text-sm text-green-800">
                <div className="flex justify-between">
                  <span>Fecha:</span>
                  <span className="font-semibold">
                    {getDiaSemanaNombre(selectedHorario.fecha)}, {new Date(selectedHorario.fecha).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Horario:</span>
                  <span className="font-semibold">
                    {selectedHorario.horaInicio} - {selectedHorario.horaFin}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duración:</span>
                  <span>{citaData.duracionProgramadaMin} min</span>
                </div>
                {selectedHorario.tipoAmbiente && (
                  <div className="flex justify-between">
                    <span>Ambiente:</span>
                    <span className="capitalize">{selectedHorario.tipoAmbiente.toLowerCase()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Volver
        </button>
        
        <button
          onClick={handleContinue}
          disabled={!selectedHorario || !tipoAtencion}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}