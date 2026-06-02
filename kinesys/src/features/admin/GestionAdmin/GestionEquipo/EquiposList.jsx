
import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import EquipoForm from "./EquipoForm"
import EquipoDetail from "./EquipoDetail"
import {
  listarEquipos,
  eliminarEquipo,
} from "@/services/equiposService"

export default function EquiposList() {
  const [equipos, setEquipos] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedEquipo, setSelectedEquipo] = useState(null)
  const [editingEquipo, setEditingEquipo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargarEquipos = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔄 EquiposList: Cargando equipos...")
      const equiposData = await listarEquipos()
      console.log("📦 EquiposList: Datos recibidos de listarEquipos:", equiposData)
      setEquipos(equiposData || [])
    } catch (err) {
      console.error("❌ EquiposList: Error cargando equipos:", err)
      setError("Error al cargar los equipos")
      setEquipos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarEquipos()
  }, [])

  const filteredEquipos = equipos.filter(
    (e) =>
      e.nombreEquipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.estado?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteEquipo = async (id) => {
    if (confirm("¿Está seguro que desea eliminar este equipo?")) {
      try {
        await eliminarEquipo(id)
        await cargarEquipos()
      } catch (error) {
        alert(error.message || "Error al eliminar el equipo")
      }
    }
  }

  if (selectedEquipo) {
    return <EquipoDetail equipo={selectedEquipo} onBack={() => setSelectedEquipo(null)} />
  }

  if (showForm) {
    return (
      <EquipoForm
        onSubmit={async (_equipoData) => {
          await cargarEquipos()
          setShowForm(false)
          setEditingEquipo(null)
        }}
        onCancel={() => {
          setShowForm(false)
          setEditingEquipo(null)
        }}
        initialData={editingEquipo}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Equipos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          <span>Nuevo Equipo</span>
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, descripción, ubicación o estado..."
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
          <p className="text-gray-600 mt-2">Cargando equipos...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={cargarEquipos}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Tabla de equipos */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Descripción</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cantidad</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ubicación</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm
                      ? "No se encontraron equipos que coincidan con la búsqueda"
                      : "No hay equipos registrados"}
                  </td>
                </tr>
              ) : (
                filteredEquipos.map((equipo) => (
                  <tr key={equipo.idEquipo} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{equipo.nombreEquipo}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{equipo.descripcion}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        equipo.estado === 'Disponible' ? 'bg-green-100 text-green-800' :
                        equipo.estado === 'En Mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {equipo.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{equipo.cantidad}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{equipo.ubicacion}</td>
                    <td className="px-6 py-4 text-sm space-x-2 flex items-center">
                      <button
                        onClick={() => setSelectedEquipo(equipo)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingEquipo(equipo)
                          setShowForm(true)
                        }}
                        className="p-2 hover:bg-green-50 text-green-600 rounded transition-colors"
                        title="Editar equipo"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteEquipo(equipo.idEquipo)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                        title="Eliminar equipo"
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
      {!loading && !error && filteredEquipos.length > 0 && (
        <div className="text-sm text-gray-500">
          Mostrando {filteredEquipos.length} de {equipos.length} equipos
        </div>
      )}
    </div>
  )
}
