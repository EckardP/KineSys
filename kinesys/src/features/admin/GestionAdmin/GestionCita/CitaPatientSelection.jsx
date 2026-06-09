// src/features/admin/GestionAdmin/GestionCita/CitaPatientSelection.jsx

import { useState, useEffect } from "react"
import { Search, User, Mail, Phone, MapPin, ArrowRight, ArrowLeft } from "lucide-react"
import { listarPacientes, obtenerPaciente } from "@/services/pacientesService"

export default function CitaPatientSelection({ citaData: _citaData, updateCitaData, onNext, onBack }) {
  const [pacientes, setPacientes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedPaciente, setSelectedPaciente] = useState(null)
  const [pacienteDetalle, setPacienteDetalle] = useState(null)

  useEffect(() => {
    cargarPacientes()
  }, [])

  useEffect(() => {
    if (selectedPaciente) {
      cargarDetallePaciente(selectedPaciente.id)
    }
  }, [selectedPaciente])

  const cargarPacientes = async () => {
    try {
      setLoading(true)
      const pacientesData = await listarPacientes()
      setPacientes(pacientesData || [])
    } catch (error) {
      console.error("Error al cargar pacientes:", error)
      setPacientes([])
    } finally {
      setLoading(false)
    }
  }

  const cargarDetallePaciente = async (idPaciente) => {
    try {
      const detalle = await obtenerPaciente(idPaciente)
      setPacienteDetalle(detalle)
    } catch (error) {
      console.error("Error al cargar detalle del paciente:", error)
    }
  }

  const filteredPacientes = pacientes.filter(paciente =>
    paciente.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.documentoIdentidad?.includes(searchTerm)
  )

  const handleSelectPaciente = (paciente) => {
    setSelectedPaciente(paciente)
    updateCitaData({
      idPaciente: paciente.id
    })
  }

  const handleContinue = () => {
    if (!selectedPaciente) {
      alert("Por favor selecciona un paciente")
      return
    }
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Paso 2: Selecciona el paciente
        </h3>
        <p className="text-gray-600">
          Busca y selecciona el paciente para la cita.
        </p>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar paciente por nombre, apellido o documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de pacientes */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Pacientes encontrados</h4>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Cargando pacientes...</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredPacientes.map((paciente) => (
                <div
                  key={paciente.id}
                  className={`
                    border rounded-lg p-4 cursor-pointer transition-all
                    ${selectedPaciente?.id === paciente.id
                      ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => handleSelectPaciente(paciente)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">
                            {paciente.nombres} {paciente.apellidos}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {paciente.tipoDocumento}: {paciente.documentoIdentidad}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {paciente.telefono && (
                          <div className="flex items-center gap-1">
                            <Phone size={14} />
                            <span>{paciente.telefono}</span>
                          </div>
                        )}
                        {paciente.correoElectronico && (
                          <div className="flex items-center gap-1">
                            <Mail size={14} />
                            <span className="truncate">{paciente.correoElectronico}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedPaciente?.id === paciente.id && (
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredPacientes.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p>No se encontraron pacientes que coincidan con la búsqueda.</p>
            </div>
          )}
        </div>

        {/* Detalle del paciente seleccionado */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Información del paciente</h4>
          
          {selectedPaciente && pacienteDetalle ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-lg text-gray-900">
                    {pacienteDetalle.nombres} {pacienteDetalle.apellidos}
                  </h5>
                  <p className="text-gray-600">
                    {pacienteDetalle.tipoDocumento}: {pacienteDetalle.documentoIdentidad}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-700">Fecha de Nacimiento</label>
                    <p className="text-gray-900">
                      {pacienteDetalle.fechaNacimiento 
                        ? new Date(pacienteDetalle.fechaNacimiento).toLocaleDateString()
                        : "No especificada"
                      }
                    </p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Género</label>
                    <p className="text-gray-900">{pacienteDetalle.genero || "No especificado"}</p>
                  </div>
                </div>

                <div>
                  <label className="font-medium text-gray-700">Contacto</label>
                  <div className="space-y-2 mt-1">
                    {pacienteDetalle.telefono && (
                      <div className="flex items-center gap-2 text-gray-900">
                        <Phone size={16} />
                        <span>{pacienteDetalle.telefono}</span>
                      </div>
                    )}
                    {pacienteDetalle.celular && (
                      <div className="flex items-center gap-2 text-gray-900">
                        <Phone size={16} />
                        <span>{pacienteDetalle.celular}</span>
                      </div>
                    )}
                    {pacienteDetalle.correoElectronico && (
                      <div className="flex items-center gap-2 text-gray-900">
                        <Mail size={16} />
                        <span>{pacienteDetalle.correoElectronico}</span>
                      </div>
                    )}
                  </div>
                </div>

                {(pacienteDetalle.direccion || pacienteDetalle.ciudad) && (
                  <div>
                    <label className="font-medium text-gray-700">Ubicación</label>
                    <div className="flex items-center gap-2 mt-1 text-gray-900">
                      <MapPin size={16} />
                      <span>
                        {[pacienteDetalle.direccion, pacienteDetalle.ciudad, pacienteDetalle.departamento]
                          .filter(Boolean).join(", ")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Información de afiliación si existe */}
                {(pacienteDetalle.numeroDeAfiliacion || pacienteDetalle.tipoAfiliado) && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <label className="font-medium text-blue-900">Información de Afiliación</label>
                    <div className="space-y-1 mt-1 text-sm">
                      {pacienteDetalle.numeroDeAfiliacion && (
                        <p><strong>N° Afiliación:</strong> {pacienteDetalle.numeroDeAfiliacion}</p>
                      )}
                      {pacienteDetalle.tipoAfiliado && (
                        <p><strong>Tipo:</strong> {pacienteDetalle.tipoAfiliado}</p>
                      )}
                      {pacienteDetalle.regimen && (
                        <p><strong>Régimen:</strong> {pacienteDetalle.regimen}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Selecciona un paciente para ver su información</p>
            </div>
          )}
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Volver
        </button>
        
        {selectedPaciente && (
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            Continuar
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
