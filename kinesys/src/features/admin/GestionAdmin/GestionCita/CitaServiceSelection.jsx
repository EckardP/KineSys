// src/features/admin/GestionAdmin/GestionCita/CitaServiceSelection.jsx

import { useState, useEffect } from "react"
import { Search, Clock, DollarSign, Info, ArrowRight } from "lucide-react"
import { listarTipoServicios } from "@/services/tipoServiciosService"

const _tiposAtencion = [
  "Inicial / valoración",
  "Tratamiento / sesión terapéutica",
  "Seguimiento",
  "Control",
  "Evolución / reevaluación",
  "Alta / cierre de tratamiento",
  "Interconsulta / derivación",
  "Preventiva / bienestar"
]

export default function CitaServiceSelection({ citaData: _citaData, updateCitaData, onNext }) {
  const [servicios, setServicios] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedServicio, setSelectedServicio] = useState(null)

  useEffect(() => {
    cargarServicios()
  }, [])

  const cargarServicios = async () => {
    try {
      setLoading(true)
      const serviciosData = await listarTipoServicios()
      setServicios(serviciosData || [])
    } catch (error) {
      console.error("Error al cargar servicios:", error)
      setServicios([])
    } finally {
      setLoading(false)
    }
  }

  const filteredServicios = servicios.filter(servicio =>
    servicio.nombreServicio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servicio.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectServicio = (servicio) => {
    setSelectedServicio(servicio)
    
    updateCitaData({
      idTipoServicio: servicio.idTipoServicio,
      duracionProgramadaMin: servicio.duracionEstandarMin || 30,
      precioBase: servicio.precio || 0,
      precioCita: servicio.precio || 0
    })
  }

  const handleContinue = () => {
    if (!selectedServicio) {
      alert("Por favor selecciona un tipo de servicio")
      return
    }
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Paso 1: Selecciona el tipo de servicio
        </h3>
        <p className="text-gray-600">
          Elige el servicio que necesitas. Esto determinará los terapeutas disponibles y el precio base.
        </p>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar servicio por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Cargando servicios...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredServicios.map((servicio) => (
            <div
              key={servicio.idTipoServicio}
              className={`
                border rounded-lg p-4 cursor-pointer transition-all
                ${selectedServicio?.idTipoServicio === servicio.idTipoServicio
                  ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }
              `}
              onClick={() => handleSelectServicio(servicio)}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900 text-lg">
                  {servicio.nombreServicio}
                </h4>
                {selectedServicio?.idTipoServicio === servicio.idTipoServicio && (
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {servicio.descripcion || "Sin descripción"}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{servicio.duracionEstandarMin || 30} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={16} />
                    <span>${servicio.precio || 0}</span>
                  </div>
                </div>
                
                {servicio.tipoSalaNecesaria && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Info size={14} />
                    <span>{servicio.tipoSalaNecesaria}</span>
                  </div>
                )}
              </div>

              {/* Compatibilidades */}
              <div className="flex gap-2 mt-3">
                {servicio.compatibleConEPS && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    EPS
                  </span>
                )}
                {servicio.compatibleConPrepagadas && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Prepagada
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredServicios.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p>No se encontraron servicios que coincidan con la búsqueda.</p>
        </div>
      )}

      {/* Servicio seleccionado */}
      {selectedServicio && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-indigo-900">
                Servicio seleccionado: {selectedServicio.nombreServicio}
              </h4>
              <p className="text-indigo-700 text-sm">
                Duración: {selectedServicio.duracionEstandarMin || 30} min • 
                Precio base: ${selectedServicio.precio || 0}
              </p>
            </div>
            <button
              onClick={handleContinue}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              Continuar
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
