"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, Eye, Clock, Users } from "lucide-react"
import TipoServicioForm from "./TipoServicioForm"
import TipoServicioDetail from "./TipoServicioDetail"
import {
  listarTipoServicios,
  eliminarTipoServicio,
} from "../../../services/tipoServiciosService"

export default function TipoServiciosList() {
  const [tipoServicios, setTipoServicios] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedTipoServicio, setSelectedTipoServicio] = useState(null)
  const [editingTipoServicio, setEditingTipoServicio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargarTipoServicios = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔄 TipoServiciosList: Cargando tipos de servicio...")
      const serviciosData = await listarTipoServicios()
      console.log("📦 TipoServiciosList: Datos recibidos:", serviciosData)
      setTipoServicios(serviciosData || [])
    } catch (err) {
      console.error("❌ TipoServiciosList: Error cargando tipos de servicio:", err)
      setError("Error al cargar los tipos de servicio")
      setTipoServicios([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarTipoServicios()
  }, [])

  const filteredTipoServicios = tipoServicios.filter(
    (s) =>
      s.nombreServicio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tipoSalaNecesaria?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteTipoServicio = async (id) => {
    if (confirm("¿Está seguro que desea eliminar este tipo de servicio?")) {
      try {
        await eliminarTipoServicio(id)
        await cargarTipoServicios()
      } catch (error) {
        alert(error.message || "Error al eliminar el tipo de servicio")
      }
    }
  }

  if (selectedTipoServicio) {
    return <TipoServicioDetail tipoServicio={selectedTipoServicio} onBack={() => setSelectedTipoServicio(null)} />
  }

  if (showForm) {
    return (
      <TipoServicioForm
        onSubmit={async () => {
          await cargarTipoServicios()
          setShowForm(false)
          setEditingTipoServicio(null)
        }}
        onCancel={() => {
          setShowForm(false)
          setEditingTipoServicio(null)
        }}
        initialData={editingTipoServicio}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Servicios</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o tipo de sala..."
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
          <p className="text-gray-600 mt-2">Cargando servicios...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={cargarTipoServicios}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Tabla de servicios */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Servicio</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Descripción</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Duración</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipo Sala</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Precio</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Compatibilidad</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTipoServicios.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm
                      ? "No se encontraron servicios que coincidan con la búsqueda"
                      : "No hay servicios registrados"}
                  </td>
                </tr>
              ) : (
                filteredTipoServicios.map((servicio) => (
                  <tr key={servicio.idTipoServicio} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{servicio.nombreServicio}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{servicio.descripcion}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock size={12} className="mr-1" />
                        {servicio.duracionEstandarMin} min
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{servicio.tipoSalaNecesaria}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">${servicio.precio?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        {servicio.compatibleConEPS && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            EPS
                          </span>
                        )}
                        {servicio.compatibleConPrepagadas && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 ml-1">
                            Prepagadas
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2 flex items-center">
                      <button
                        onClick={() => setSelectedTipoServicio(servicio)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingTipoServicio(servicio)
                          setShowForm(true)
                        }}
                        className="p-2 hover:bg-green-50 text-green-600 rounded transition-colors"
                        title="Editar servicio"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTipoServicio(servicio.idTipoServicio)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                        title="Eliminar servicio"
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
      {!loading && !error && filteredTipoServicios.length > 0 && (
        <div className="text-sm text-gray-500">
          Mostrando {filteredTipoServicios.length} de {tipoServicios.length} servicios
        </div>
      )}
    </div>
  )
}