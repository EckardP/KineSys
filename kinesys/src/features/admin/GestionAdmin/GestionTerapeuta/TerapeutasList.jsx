
import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, Eye, Clock } from "lucide-react"
import TerapeutaForm from "./TerapeutaForm"
import TerapeutaDetail from "./TerapeutaDetail"
import HorariosModal from "./HorariosModal"
import {
  listarTerapeutas,
  eliminarTerapeuta,
} from "@/services/terapeutasService"

export default function TerapeutasList() {
  const [terapeutas, setTerapeutas] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedTerapeuta, setSelectedTerapeuta] = useState(null)
  const [editingTerapeuta, setEditingTerapeuta] = useState(null)
  const [showHorariosModal, setShowHorariosModal] = useState(false)
  const [terapeutaHorarios, setTerapeutaHorarios] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargarTerapeutas = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔄 TerapeutasList: Cargando terapeutas...")
      const terapeutasData = await listarTerapeutas()
      console.log("📦 TerapeutasList: Datos recibidos de listarTerapeutas:", terapeutasData)
      setTerapeutas(terapeutasData || [])
    } catch (err) {
      console.error("❌ TerapeutasList: Error cargando terapeutas:", err)
      setError("Error al cargar los terapeutas")
      setTerapeutas([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarTerapeutas()
  }, [])

  const filteredTerapeutas = terapeutas.filter(
    (t) =>
      t.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.documentoIdentidad?.includes(searchTerm),
  )

  const handleDeleteTerapeuta = async (id) => {
    if (confirm("¿Está seguro que desea eliminar este terapeuta?")) {
      try {
        await eliminarTerapeuta(id)
        await cargarTerapeutas()
      } catch (error) {
        alert(error.message || "Error al eliminar el terapeuta")
      }
    }
  }

  const abrirModalHorarios = (terapeuta) => {
    setTerapeutaHorarios(terapeuta)
    setShowHorariosModal(true)
  }

  if (selectedTerapeuta) {
    return <TerapeutaDetail terapeuta={selectedTerapeuta} onBack={() => setSelectedTerapeuta(null)} />
  }

  if (showForm) {
    return (
      <TerapeutaForm
        onSubmit={async (_terapeutaData) => {
          // Esta función se pasará al formulario y se encargará de guardar el terapeuta
          // Luego recargar la lista y cerrar el formulario
          await cargarTerapeutas()
          setShowForm(false)
          setEditingTerapeuta(null)
        }}
        onCancel={() => {
          setShowForm(false)
          setEditingTerapeuta(null)
        }}
        initialData={editingTerapeuta}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Terapeutas</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          <span>Nuevo Terapeuta</span>
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o documento..."
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
          <p className="text-gray-600 mt-2">Cargando terapeutas...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={cargarTerapeutas}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Tabla de terapeutas */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Documento</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Licencia</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Título</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Experiencia</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contacto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTerapeutas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm
                      ? "No se encontraron terapeutas que coincidan con la búsqueda"
                      : "No hay terapeutas registrados"}
                  </td>
                </tr>
              ) : (
                filteredTerapeutas.map((terapeuta) => (
                  <tr key={terapeuta.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{terapeuta.documentoIdentidad}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {terapeuta.nombres} {terapeuta.apellidos}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{terapeuta.noLicencia}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{terapeuta.tituloAcademico}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {terapeuta.añosExperiencia} años
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{terapeuta.telefono || "No registrado"}</div>
                      <div>{terapeuta.correoElectronico || "No registrado"}</div>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2 flex items-center">
                      <button
                        onClick={() => setSelectedTerapeuta(terapeuta)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => abrirModalHorarios(terapeuta)}
                        className="p-2 hover:bg-green-50 text-green-600 rounded transition-colors"
                        title="Gestionar horarios"
                      >
                        <Clock size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingTerapeuta(terapeuta)
                          setShowForm(true)
                        }}
                        className="p-2 hover:bg-green-50 text-green-600 rounded transition-colors"
                        title="Editar terapeuta"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTerapeuta(terapeuta.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                        title="Eliminar terapeuta"
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
      {!loading && !error && filteredTerapeutas.length > 0 && (
        <div className="text-sm text-gray-500">
          Mostrando {filteredTerapeutas.length} de {terapeutas.length} terapeutas
        </div>
      )}

      {/* Modal de Horarios */}
      {showHorariosModal && terapeutaHorarios && (
        <HorariosModal
          terapeuta={terapeutaHorarios}
          onClose={() => {
            setShowHorariosModal(false)
            setTerapeutaHorarios(null)
          }}
        />
      )}
    </div>
  )
}
