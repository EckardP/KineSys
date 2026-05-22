
import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import PatientForm from "./PatientForm"
import PatientDetail from "./PatientDetail"
import { listarPacientes, crearPaciente, actualizarPaciente, eliminarPaciente } from "../../../../services/pacientesService"

export default function PatientList() {
  const [patients, setPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [editingPatient, setEditingPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar pacientes desde la API
  const cargarPacientes = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔄 PatientList: Cargando pacientes...")
      const pacientesData = await listarPacientes()
      console.log("📦 PatientList: Datos recibidos de listarPacientes:", pacientesData)
      setPatients(pacientesData || [])
    } catch (err) {
      console.error('❌ PatientList: Error cargando pacientes:', err)
      setError('Error al cargar los pacientes')
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarPacientes()
  }, [])

  const filteredPatients = patients.filter(
    (p) => 
      p.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.documentoIdentidad?.includes(searchTerm)
  )

  const handleAddPatient = async (patientData) => {
    try {
      console.log("🔄 PatientList: handleAddPatient llamado con datos:", patientData)
      
      if (editingPatient) {
        console.log("📝 Editando paciente existente...")
        await actualizarPaciente(editingPatient.id, patientData)
      } else {
        console.log("➕ Creando nuevo paciente...")
        const resultado = await crearPaciente(patientData)
        console.log("✅ Paciente creado:", resultado)
      }
      
      // Recargar la lista después de guardar
      await cargarPacientes()
      setShowForm(false)
      setEditingPatient(null)
      
      console.log("🎉 Paciente guardado y lista actualizada")
      
    } catch (error) {
      console.error("❌ Error en handleAddPatient:", error)
      alert(error.message || "Error al guardar el paciente")
    }
  }

  const handleDeletePatient = async (id) => {
    if (confirm("¿Está seguro que desea eliminar este paciente?")) {
      try {
        await eliminarPaciente(id)
        await cargarPacientes()
      } catch (error) {
        alert(error.message || "Error al eliminar el paciente")
      }
    }
  }

  if (selectedPatient) {
    return <PatientDetail patient={selectedPatient} onBack={() => setSelectedPatient(null)} />
  }

  if (showForm) {
    return (
      <PatientForm
        onSubmit={handleAddPatient}
        onCancel={() => {
          setShowForm(false)
          setEditingPatient(null)
        }}
        initialData={editingPatient}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Pacientes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          <span>Nuevo Paciente</span>
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
          <p className="text-gray-600 mt-2">Cargando pacientes...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={cargarPacientes}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Tabla de pacientes */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Documento</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No se encontraron pacientes que coincidan con la búsqueda' : 'No hay pacientes registrados'}
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {patient.documentoIdentidad}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {patient.nombres} {patient.apellidos}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.telefono || 'No registrado'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.correoElectronico || 'No registrado'}</td>
                    <td className="px-6 py-4 text-sm space-x-2 flex items-center">
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingPatient(patient)
                          setShowForm(true)
                        }}
                        className="p-2 hover:bg-green-50 text-green-600 rounded transition-colors"
                        title="Editar paciente"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletePatient(patient.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                        title="Eliminar paciente"
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
      {!loading && !error && filteredPatients.length > 0 && (
        <div className="text-sm text-gray-500">
          Mostrando {filteredPatients.length} de {patients.length} pacientes
        </div>
      )}
    </div>
  )
}
