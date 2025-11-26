// kinesys\src\pages\TerapeutaHome\components\Treatments\TratamientosView.jsx
"use client"

import { useState, useEffect } from "react"
import { Search, Eye, Stethoscope, Clock, Users, Award } from "lucide-react"
import { listarTratamientos } from "../../../../services/tratamientosService"
import { listarEspecialidades } from "../../../../services/especialidadesService"
import TratamientoDetail from "../../../GestionAdmin/GestionTratamiento/TratamientoDetail"

export default function TratamientosView() {
  const [tratamientos, setTratamientos] = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTratamiento, setSelectedTratamiento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargarTratamientos = async () => {
    try {
      setLoading(true)
      setError(null)
      const tratamientosData = await listarTratamientos()
      setTratamientos(tratamientosData || [])
    } catch (err) {
      console.error("Error cargando tratamientos:", err)
      setError("Error al cargar los tratamientos")
      setTratamientos([])
    } finally {
      setLoading(false)
    }
  }

  const cargarEspecialidades = async () => {
    try {
      const especialidadesData = await listarEspecialidades()
      setEspecialidades(especialidadesData || [])
    } catch (error) {
      console.error("Error cargando especialidades:", error)
    }
  }

  useEffect(() => {
    cargarTratamientos()
    cargarEspecialidades()
  }, [])

  const filteredTratamientos = tratamientos.filter(
    (t) =>
      t.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.especialidad?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getEspecialidadNombre = (idEspecialidad) => {
    const especialidad = especialidades.find(esp => esp.id === idEspecialidad)
    return especialidad?.nombre || "No asignada"
  }

  if (selectedTratamiento) {
    return <TratamientoDetail tratamiento={selectedTratamiento} onBack={() => setSelectedTratamiento(null)} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Stethoscope className="w-8 h-8 text-blue-600" />
            Catálogo de Tratamientos
          </h1>
          <p className="text-gray-600 mt-1">Consulta los tratamientos y terapias disponibles</p>
        </div>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Tratamientos</p>
              <p className="text-2xl font-bold text-gray-900">{tratamientos.length}</p>
            </div>
            <Stethoscope className="text-blue-600 opacity-20" size={32} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Activos</p>
              <p className="text-2xl font-bold text-green-600">
                {tratamientos.filter(t => t.activo).length}
              </p>
            </div>
            <Award className="text-green-600 opacity-20" size={32} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Especialidades</p>
              <p className="text-2xl font-bold text-purple-600">{especialidades.length}</p>
            </div>
            <Users className="text-purple-600 opacity-20" size={32} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Duración Promedio</p>
              <p className="text-2xl font-bold text-orange-600">30 min</p>
            </div>
            <Clock className="text-orange-600 opacity-20" size={32} />
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar tratamiento por nombre, descripción o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
        </div>
      </div>

      {/* Estados de carga y error */}
      {loading && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Cargando tratamientos...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={cargarTratamientos}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Grid de tratamientos */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTratamientos.length === 0 ? (
            <div className="col-span-full bg-white p-8 rounded-lg border border-gray-200 text-center">
              <p className="text-gray-500 text-lg">
                {searchTerm
                  ? "No se encontraron tratamientos que coincidan con la búsqueda"
                  : "No hay tratamientos disponibles"}
              </p>
            </div>
          ) : (
            filteredTratamientos.map((tratamiento) => (
              <div
                key={tratamiento.id}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {tratamiento.nombre}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tratamiento.activo
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tratamiento.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {tratamiento.descripcion || "Sin descripción disponible"}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Especialidad:</span>
                      <span className="font-medium text-gray-700">
                        {getEspecialidadNombre(tratamiento.idEspecialidad)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duración:</span>
                      <span className="font-medium text-gray-700">
                        {tratamiento.duracionMinutos || 30} min
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Sesiones:</span>
                      <span className="font-medium text-gray-700">
                        {tratamiento.sesionesRecomendadas || 1}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Costo:</span>
                      <span className="font-medium text-green-600">
                        ${(tratamiento.costoBase || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedTratamiento(tratamiento)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    Ver Detalles Completos
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Información de resultados */}
      {!loading && !error && filteredTratamientos.length > 0 && (
        <div className="text-sm text-gray-500">
          Mostrando {filteredTratamientos.length} de {tratamientos.length} tratamientos
        </div>
      )}
    </div>
  )
}