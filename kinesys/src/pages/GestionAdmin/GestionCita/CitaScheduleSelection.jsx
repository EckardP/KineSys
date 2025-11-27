// src/pages/GestionCita/CitaScheduleSelection.jsx
"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, ArrowRight, ArrowLeft } from "lucide-react"

export default function CitaScheduleSelection({ citaData, updateCitaData, onNext, onBack }) {
  const [fecha, setFecha] = useState("")
  const [hora, setHora] = useState("")
  const [tipoAtencion, setTipoAtencion] = useState(citaData.tipoAtencion || "")
  const [motivo, setMotivo] = useState(citaData.motivo || "")

  useEffect(() => {
    if (citaData.fechaHora) {
      const date = new Date(citaData.fechaHora)
      setFecha(date.toISOString().split('T')[0])
      setHora(date.toTimeString().slice(0,5))
    }
  }, [citaData.fechaHora])

  const handleContinue = () => {
    if (!fecha || !hora) {
      alert("Por favor selecciona fecha y hora")
      return
    }

    const fechaHora = new Date(`${fecha}T${hora}`)
    updateCitaData({
      fechaHora: fechaHora.toISOString(),
      tipoAtencion,
      motivo
    })
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Paso 4: Selecciona fecha, hora y tipo de atención
        </h3>
        <p className="text-gray-600">
          Elige la fecha, hora y tipo de atención para la cita.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selector de fecha y hora */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de la cita
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hora de inicio
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
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
              onChange={(e) => setTipoAtencion(e.target.value)}
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
              onChange={(e) => setMotivo(e.target.value)}
              rows={4}
              placeholder="Describe el motivo de la cita..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Información resumida */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Resumen de la cita</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Fecha:</span>
                <span>{fecha ? new Date(fecha).toLocaleDateString() : 'No seleccionada'}</span>
              </div>
              <div className="flex justify-between">
                <span>Hora:</span>
                <span>{hora || 'No seleccionada'}</span>
              </div>
              <div className="flex justify-between">
                <span>Duración:</span>
                <span>{citaData.duracionProgramadaMin} min</span>
              </div>
            </div>
          </div>
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
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          Continuar
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}