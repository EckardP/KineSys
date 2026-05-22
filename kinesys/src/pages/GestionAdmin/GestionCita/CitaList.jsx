// src/pages/GestionCita/CitaList.jsx

import { useState, useEffect } from "react"
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  Users,
  Clock,
  DollarSign
} from "lucide-react"
import CitaForm from "./CitaForm"
import CitaDetail from "./CitaDetail"
import { 
  listarCitas, 
  eliminarCita,
  confirmarCita,
  cancelarCita
} from "../../../services/citasService"
import { listarPacientes } from "../../../services/pacientesService"
import { listarTerapeutas } from "../../../services/terapeutasService"
import { listarTipoServicios } from "../../../services/tipoServiciosService"

export default function CitaList() {
  const [citas, setCitas] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [terapeutas, setTerapeutas] = useState([])
  const [tipoServicios, setTipoServicios] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedCita, setSelectedCita] = useState(null)
  const [editingCita, setEditingCita] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Función para cargar todos los datos necesarios
  const cargarDatos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Cargar todos los datos en paralelo
      const [citasData, pacientesData, terapeutasData, tipoServiciosData] = await Promise.all([
        listarCitas(),
        listarPacientes(),
        listarTerapeutas(),
        listarTipoServicios()
      ])
      
      setCitas(citasData || [])
      setPacientes(pacientesData || [])
      setTerapeutas(terapeutasData || [])
      setTipoServicios(tipoServiciosData || [])
      
    } catch (err) {
      console.error("Error cargando datos:", err)
      setError("Error al cargar los datos")
      setCitas([])
      setPacientes([])
      setTerapeutas([])
      setTipoServicios([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  // Función para obtener el nombre completo del paciente
  const obtenerNombrePaciente = (idPaciente) => {
    const paciente = pacientes.find(p => p.id === idPaciente)
    return paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'Paciente no encontrado'
  }

  // Función para obtener el nombre completo del terapeuta
  const obtenerNombreTerapeuta = (idTerapeuta) => {
    const terapeuta = terapeutas.find(t => t.id === idTerapeuta)
    return terapeuta ? `${terapeuta.nombres} ${terapeuta.apellidos}` : 'Terapeuta no encontrado'
  }

  // Función para obtener el nombre del servicio
  const obtenerNombreServicio = (idTipoServicio) => {
    const servicio = tipoServicios.find(s => s.idTipoServicio === idTipoServicio)
    return servicio ? servicio.nombreServicio : 'Servicio no encontrado'
  }

  // Filtrar citas basado en el término de búsqueda
  const filteredCitas = citas.filter(cita => {
    const pacienteNombre = obtenerNombrePaciente(cita.idPaciente).toLowerCase()
    const terapeutaNombre = obtenerNombreTerapeuta(cita.idTerapeuta).toLowerCase()
    const servicioNombre = obtenerNombreServicio(cita.idTipoServicio).toLowerCase()
    
    return (
      cita.motivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.estado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.tipoAtencion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pacienteNombre.includes(searchTerm.toLowerCase()) ||
      terapeutaNombre.includes(searchTerm.toLowerCase()) ||
      servicioNombre.includes(searchTerm.toLowerCase())
    )
  })

  const handleDeleteCita = async (id) => {
    if (confirm("¿Está seguro que desea eliminar esta cita?")) {
      try {
        await eliminarCita(id)
        await cargarDatos()
      } catch (error) {
        alert(error.message || "Error al eliminar la cita")
      }
    }
  }

  const handleConfirmCita = async (id) => {
    try {
      await confirmarCita(id)
      await cargarDatos()
    } catch (error) {
      alert(error.message || "Error al confirmar la cita")
    }
  }

  const handleCancelCita = async (id) => {
    try {
      await cancelarCita(id)
      await cargarDatos()
    } catch (error) {
      alert(error.message || "Error al cancelar la cita")
    }
  }

  const getEstadoBadge = (estado) => {
    const estados = {
      Pendiente: "bg-yellow-100 text-yellow-800",
      Confirmada: "bg-green-100 text-green-800",
      Cancelada: "bg-red-100 text-red-800",
      Completada: "bg-blue-100 text-blue-800",
      Inasistencia: "bg-orange-100 text-orange-800"
    }
    return estados[estado] || "bg-gray-100 text-gray-800"
  }

  if (selectedCita) {
    return (
      <CitaDetail 
        cita={selectedCita} 
        onBack={() => setSelectedCita(null)}
        onEdit={() => {
          setEditingCita(selectedCita)
          setShowForm(true)
          setSelectedCita(null)
        }}
      />
    )
  }

  if (showForm) {
    return (
      <CitaForm
        onCancel={() => {
          setShowForm(false)
          setEditingCita(null)
        }}
        onSubmitSuccess={() => {
          setShowForm(false)
          setEditingCita(null)
          cargarDatos()
        }}
        initialData={editingCita}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Citas</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Nueva Cita</span>
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por paciente, terapeuta, servicio, motivo, estado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
        </div>
      </div>

      {/* Estados de carga y error */}
      {loading && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Cargando citas...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={cargarDatos}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Estadísticas rápidas */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-indigo-600">{citas.length}</div>
            <div className="text-sm text-gray-600">Total Citas</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600">
              {citas.filter(c => c.estado === 'Confirmada').length}
            </div>
            <div className="text-sm text-gray-600">Confirmadas</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {citas.filter(c => c.estado === 'Pendiente').length}
            </div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-red-600">
              {citas.filter(c => c.estado === 'Cancelada').length}
            </div>
            <div className="text-sm text-gray-600">Canceladas</div>
          </div>
        </div>
      )}

      {/* Tabla de citas */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha y Hora</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Paciente</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Terapeuta</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Servicio</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Precio</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCitas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm
                      ? "No se encontraron citas que coincidan con la búsqueda"
                      : "No hay citas registradas"}
                  </td>
                </tr>
              ) : (
                filteredCitas.map((cita) => (
                  <tr key={cita.idCita} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {cita.fechaHora ? new Date(cita.fechaHora).toLocaleDateString('es-ES') : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {cita.fechaHora ? new Date(cita.fechaHora).toLocaleTimeString('es-ES', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            }) : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {obtenerNombrePaciente(cita.idPaciente)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Paciente ID: {cita.idPaciente}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {obtenerNombreTerapeuta(cita.idTerapeuta)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Terapeuta ID: {cita.idTerapeuta}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {obtenerNombreServicio(cita.idTipoServicio)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Servicio ID: {cita.idTipoServicio}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoBadge(cita.estado)}`}>
                        {cita.estado || "Pendiente"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          ${(cita.precioCita || 0).toLocaleString('es-ES')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2 flex items-center">
                      <button
                        onClick={() => setSelectedCita(cita)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingCita(cita)
                          setShowForm(true)
                        }}
                        className="p-2 hover:bg-green-50 text-green-600 rounded transition-colors"
                        title="Editar cita"
                      >
                        <Edit size={18} />
                      </button>
                      {cita.estado === "Pendiente" && (
                        <>
                          <button
                            onClick={() => handleConfirmCita(cita.idCita)}
                            className="p-2 hover:bg-green-50 text-green-600 rounded transition-colors"
                            title="Confirmar cita"
                          >
                            <Clock size={18} />
                          </button>
                          <button
                            onClick={() => handleCancelCita(cita.idCita)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                            title="Cancelar cita"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                      {cita.estado !== "Pendiente" && (
                        <button
                          onClick={() => handleDeleteCita(cita.idCita)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                          title="Eliminar cita"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Información de resultados */}
      {!loading && !error && filteredCitas.length > 0 && (
        <div className="text-sm text-gray-500">
          Mostrando {filteredCitas.length} de {citas.length} citas
          {searchTerm && (
            <span className="ml-2">
              • Filtrado por: "{searchTerm}"
            </span>
          )}
        </div>
      )}
    </div>
  )
}
