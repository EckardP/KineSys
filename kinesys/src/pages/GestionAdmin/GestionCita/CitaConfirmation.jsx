// src/pages/GestionCita/CitaConfirmation.jsx
"use client"

import { useState, useEffect } from "react"
import { 
  Calendar, 
  User, 
  Users, 
  Clock, 
  DollarSign, 
  Save,
  ArrowLeft,
  Plus
} from "lucide-react"
import { listarSalas } from "../../../services/salasService"

export default function CitaConfirmation({ citaData, updateCitaData, onBack, onSubmit, loading, isEditing }) {
  const [salas, setSalas] = useState([])
  const [agregadoPrecio, setAgregadoPrecio] = useState(citaData.agregadoPrecio || 0)
  const [salaSeleccionada, setSalaSeleccionada] = useState(citaData.idSala || "")

  useEffect(() => {
    cargarSalas()
  }, [])

  const cargarSalas = async () => {
    try {
      const salasData = await listarSalas()
      setSalas(salasData || [])
    } catch (error) {
      console.error("Error al cargar salas:", error)
    }
  }

  const handleAgregadoPrecioChange = (value) => {
    setAgregadoPrecio(value)
    updateCitaData({
      agregadoPrecio: value,
      precioCita: (citaData.precioBase || 0) + value
    })
  }

  const handleSalaChange = (idSala) => {
    setSalaSeleccionada(idSala)
    updateCitaData({ idSala: idSala || null })
  }

  const precioTotal = (citaData.precioBase || 0) + (agregadoPrecio || 0)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Paso 5: Confirma los detalles de la cita
        </h3>
        <p className="text-gray-600">
          Revisa toda la información y confirma la cita.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resumen de la cita */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-lg text-gray-900 mb-4">Resumen de la cita</h4>
            
            <div className="space-y-4">
              {/* Servicio */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Servicio</h5>
                    <p className="text-gray-600">{citaData.idTipoServicio ? `ID: ${citaData.idTipoServicio}` : "No seleccionado"}</p>
                  </div>
                </div>
              </div>

              {/* Paciente */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Paciente</h5>
                    <p className="text-gray-600">{citaData.idPaciente ? `ID: ${citaData.idPaciente}` : "No seleccionado"}</p>
                  </div>
                </div>
              </div>

              {/* Terapeuta */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Terapeuta</h5>
                    <p className="text-gray-600">{citaData.idTerapeuta ? `ID: ${citaData.idTerapeuta}` : "No seleccionado"}</p>
                  </div>
                </div>
              </div>

              {/* Fecha y Hora */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Fecha y Hora</h5>
                    <p className="text-gray-600">
                      {citaData.fechaHora 
                        ? new Date(citaData.fechaHora).toLocaleString() 
                        : "No seleccionada"
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Duración */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Duración</h5>
                    <p className="text-gray-600">{citaData.duracionProgramadaMin} minutos</p>
                  </div>
                </div>
              </div>

              {/* Tipo de atención */}
              {citaData.tipoAtencion && (
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">Tipo de atención</h5>
                    <p className="text-gray-600">{citaData.tipoAtencion}</p>
                  </div>
                </div>
              )}

              {/* Motivo */}
              {citaData.motivo && (
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">Motivo</h5>
                    <p className="text-gray-600">{citaData.motivo}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Configuración de precio */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-lg text-gray-900 mb-4">Configuración de precio</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Precio base del servicio</span>
                <span className="font-semibold">${citaData.precioBase || 0}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agregado al precio (opcional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={agregadoPrecio}
                    onChange={(e) => handleAgregadoPrecioChange(Number(e.target.value))}
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Este valor se sumará al precio base del servicio.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Precio total</span>
                  <span className="text-lg font-bold text-indigo-600">${precioTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuración adicional */}
        <div className="space-y-6">
          {/* Selección de sala */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-lg text-gray-900 mb-4">Sala de atención</h4>
            
            <div className="space-y-3">
              <select
                value={salaSeleccionada}
                onChange={(e) => handleSalaChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Selecciona una sala</option>
                {salas.map((sala) => (
                  <option key={sala.idSala} value={sala.idSala}>
                    {sala.nombre} - {sala.tipo}
                  </option>
                ))}
              </select>

              {salaSeleccionada && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <h5 className="font-medium text-blue-900">Sala seleccionada</h5>
                  {salas.find(s => s.idSala == salaSeleccionada) && (
                    <div className="text-sm text-blue-800 mt-1">
                      <p><strong>Nombre:</strong> {salas.find(s => s.idSala == salaSeleccionada).nombre}</p>
                      <p><strong>Tipo:</strong> {salas.find(s => s.idSala == salaSeleccionada).tipo}</p>
                      <p><strong>Capacidad:</strong> {salas.find(s => s.idSala == salaSeleccionada).capacidad} personas</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Estado de la cita */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-lg text-gray-900 mb-4">Estado de la cita</h4>
            
            <select
              value={citaData.estado || "Pendiente"}
              onChange={(e) => updateCitaData({ estado: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Cancelada">Cancelada</option>
              <option value="Completada">Completada</option>
            </select>

            <p className="text-sm text-gray-500 mt-2">
              El estado por defecto es "Pendiente". Puedes cambiarlo según sea necesario.
            </p>
          </div>

          {/* Resumen final */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-semibold text-lg text-green-900 mb-2">¡Todo listo!</h4>
            <p className="text-green-700 text-sm">
              Revisa que toda la información sea correcta antes de confirmar la cita.
            </p>
            
            <div className="mt-4 space-y-2 text-sm text-green-800">
              <div className="flex justify-between">
                <span>Precio total:</span>
                <span className="font-semibold">${precioTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Duración:</span>
                <span>{citaData.duracionProgramadaMin} min</span>
              </div>
              <div className="flex justify-between">
                <span>Estado:</span>
                <span>{citaData.estado || "Pendiente"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <ArrowLeft size={20} />
          Volver
        </button>
        
        <button
          onClick={onSubmit}
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {isEditing ? "Actualizando..." : "Creando..."}
            </>
          ) : (
            <>
              <Save size={20} />
              {isEditing ? "Actualizar Cita" : "Confirmar Cita"}
            </>
          )}
        </button>
      </div>
    </div>
  )
}