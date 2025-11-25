// src/pages/GestionAdmin/GestionTratamiento/TratamientosList.jsx
"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, Eye, Stethoscope, Clock, Users, Award } from "lucide-react"
import TratamientoForm from "./TratamientoForm"
import TratamientoDetail from "./TratamientoDetail"
import { listarTratamientos, eliminarTratamiento } from "../../../services/tratamientosService"
import { listarEspecialidades } from "../../../services/especialidadesService"

export default function TratamientosList() {
  const [tratamientos, setTratamientos] = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedTratamiento, setSelectedTratamiento] = useState(null)
  const [editingTratamiento, setEditingTratamiento] = useState(null)
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

  const handleAddTratamiento = async (tratamientoData) => {
    try {
      await cargarTratamientos()
      setShowForm(false)
      setEditingTratamiento(null)
    } catch (error) {
      console.error("Error en handleAddTratamiento:", error)
      alert(error.message || "Error al guardar el tratamiento")
    }
  }

  const handleDeleteTratamiento = async (id) => {
    if (confirm("¿Está seguro que desea eliminar este tratamiento?")) {
      try {
        await eliminarTratamiento(id)
        await cargarTratamientos()
      } catch (error) {
        alert(error.message || "Error al eliminar el tratamiento")
      }
    }
  }

  const getEspecialidadNombre = (idEspecialidad) => {
    const especialidad = especialidades.find(esp => esp.id === idEspecialidad)
    return especialidad?.nombre || "No asignada"
  }

  if (selectedTratamiento) {
    return <TratamientoDetail tratamiento={selectedTratamiento} onBack={() => setSelectedTratamiento(null)} />
  }

  if (showForm) {
    return (
      <TratamientoForm
        onSubmit={handleAddTratamiento}
        onCancel={() => {
          setShowForm(false)
          setEditingTratamiento(null)
        }}
        initialData={editingTratamiento}
        especialidades={especialidades}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Stethoscope className="w-8 h-8 text-blue-600" />
            Gestión de Tratamientos
          </h1>
          <p className="text-gray-600 mt-1">Administra los tratamientos y terapias disponibles</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Nuevo Tratamiento</span>
        </button>
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
            placeholder="Buscar por nombre, descripción o especialidad..."
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

      {/* Tabla de tratamientos */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Descripción</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Especialidad</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Duración</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTratamientos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm
                      ? "No se encontraron tratamientos que coincidan con la búsqueda"
                      : "No hay tratamientos registrados"}
                  </td>
                </tr>
              ) : (
                filteredTratamientos.map((tratamiento) => (
                  <tr key={tratamiento.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{tratamiento.nombre}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {tratamiento.descripcion || "Sin descripción"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getEspecialidadNombre(tratamiento.idEspecialidad)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {tratamiento.duracionMinutos || 30} min
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tratamiento.activo
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tratamiento.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2 flex items-center">
                      <button
                        onClick={() => setSelectedTratamiento(tratamiento)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingTratamiento(tratamiento)
                          setShowForm(true)
                        }}
                        className="p-2 hover:bg-green-50 text-green-600 rounded transition-colors"
                        title="Editar tratamiento"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTratamiento(tratamiento.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                        title="Eliminar tratamiento"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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