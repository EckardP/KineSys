"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, Eye, Users, MapPin, Building } from "lucide-react"
import SalaForm from "./SalaForm"
import SalaDetail from "./SalaDetail"
import {
  listarSalas,
  eliminarSala,
} from "../../../services/salasService"

export default function SalasList() {
  const [salas, setSalas] = useState([])  
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedSala, setSelectedSala] = useState(null)
  const [editingSala, setEditingSala] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargarSalas = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔄 SalasList: Cargando salas...")
      const salasData = await listarSalas()
      console.log("📦 SalasList: Datos recibidos de listarSalas:", salasData)
      setSalas(salasData || [])
    } catch (err) {
      console.error("❌ SalasList: Error cargando salas:", err)
      setError("Error al cargar las salas")
      setSalas([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarSalas()
  }, [])

  const filteredSalas = salas.filter(
    (s) =>
      s.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.estado?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteSala = async (id) => {
    if (confirm("¿Está seguro que desea eliminar esta sala?")) {
      try {
        await eliminarSala(id)
        await cargarSalas()
      } catch (error) {
        alert(error.message || "Error al eliminar la sala")
      }
    }
  }

  if (selectedSala) {
    return <SalaDetail sala={selectedSala} onBack={() => setSelectedSala(null)} />
  }

  if (showForm) {
    return (
      <SalaForm
        onSubmit={async () => {
          await cargarSalas()
          setShowForm(false)
          setEditingSala(null)
        }}
        onCancel={() => {
          setShowForm(false)
          setEditingSala(null)
        }}
        initialData={editingSala}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Salas</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          <span>Nueva Sala</span>
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, tipo, ubicación o estado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
          />
        </div>
      </div>

      {/* Estados de carga y error */}
      {loading && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-600 mt-2">Cargando salas...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={cargarSalas}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Tabla de salas */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Capacidad</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ubicación</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm
                      ? "No se encontraron salas que coincidan con la búsqueda"
                      : "No hay salas registradas"}
                  </td>
                </tr>
              ) : (
                filteredSalas.map((sala) => (
                  <tr key={sala.idSala} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Building className="text-blue-600" size={18} />
                        <span className="text-sm font-medium text-gray-900">{sala.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sala.tipo}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sala.estado === 'Disponible' ? 'bg-green-100 text-green-800' :
                        sala.estado === 'Ocupada' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sala.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users size={16} className="text-gray-400 mr-1" />
                        {sala.capacidad || "No especificada"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin size={16} className="text-gray-400 mr-1" />
                        {sala.ubicacion || "No especificada"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2 flex items-center">
                      <button
                        onClick={() => setSelectedSala(sala)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingSala(sala)
                          setShowForm(true)
                        }}
                        className="p-2 hover:bg-green-50 text-green-600 rounded transition-colors"
                        title="Editar sala"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteSala(sala.idSala)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                        title="Eliminar sala"
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
      {!loading && !error && filteredSalas.length > 0 && (
        <div className="text-sm text-gray-500">
          Mostrando {filteredSalas.length} de {salas.length} salas
        </div>
      )}
    </div>
  )
}