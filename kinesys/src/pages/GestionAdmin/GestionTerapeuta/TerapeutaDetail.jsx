
import { ArrowLeft, Phone, Mail, MapPin, Calendar, User, Award, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { obtenerEspecialidad } from "../../../services/especialidadesService"

export default function TerapeutaDetail({ terapeuta, onBack }) {
  const [especialidad, setEspecialidad] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorEspecialidad, setErrorEspecialidad] = useState(null)

  console.log("📋 TerapeutaDetail: Datos del terapeuta:", terapeuta)
  console.log("🔍 TerapeutaDetail: idEspecialidad:", terapeuta?.idEspecialidad, "tipo:", typeof terapeuta?.idEspecialidad)

  useEffect(() => {
    const cargarDatosAdicionales = async () => {
      setLoading(true)
      setErrorEspecialidad(null)

      console.log("🔄 TerapeutaDetail: Iniciando carga de datos adicionales...")

      try {
        if (terapeuta?.idEspecialidad) {
          console.log(`🔄 TerapeutaDetail: Cargando especialidad con ID: ${terapeuta.idEspecialidad}`)
          try {
            const especialidadData = await obtenerEspecialidad(terapeuta.idEspecialidad)
            console.log("✅ TerapeutaDetail: Especialidad cargada:", especialidadData)
            setEspecialidad(especialidadData)
          } catch (error) {
            console.error("❌ TerapeutaDetail: Error al cargar especialidad:", error)
            setErrorEspecialidad(error.message)
            setEspecialidad(null)
          }
        } else {
          console.log("ℹ️ TerapeutaDetail: No hay idEspecialidad, no se cargará especialidad")
          setEspecialidad(null)
        }
      } catch (error) {
        console.error("❌ TerapeutaDetail: Error general en carga de datos:", error)
      } finally {
        setLoading(false)
        console.log("🏁 TerapeutaDetail: Carga de datos adicionales finalizada")
        console.log("📊 TerapeutaDetail: Estado final - Especialidad:", especialidad)
      }
    }

    cargarDatosAdicionales()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terapeuta?.idEspecialidad])

  if (loading) {
    return (
      <div className="space-y-6">
        <Button onClick={onBack} variant="ghost" className="flex items-center space-x-2">
          <ArrowLeft size={20} />
          <span>Volver</span>
        </Button>
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando información adicional...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="ghost" className="flex items-center space-x-2">
        <ArrowLeft size={20} />
        <span>Volver</span>
      </Button>

      {errorEspecialidad && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">
            <strong>Advertencia Especialidad:</strong> {errorEspecialidad}
          </p>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              {terapeuta.nombres} {terapeuta.apellidos}
            </h1>
            <p className="text-gray-600 mt-1">
              {terapeuta.tipoDocumento}: {terapeuta.documentoIdentidad}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información Personal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Información Personal</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Género</p>
                  <p className="font-medium">{terapeuta.genero}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                  <p className="font-medium">
                    {terapeuta.fechaNacimiento
                      ? new Date(terapeuta.fechaNacimiento).toLocaleDateString()
                      : "No especificada"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium">{terapeuta.telefono || "No especificado"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Celular</p>
                  <p className="font-medium">{terapeuta.celular || "No especificado"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{terapeuta.correoElectronico || "No especificado"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información de Contacto y Ubicación */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Ubicación</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p className="font-medium">{terapeuta.direccion || "No especificada"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ciudad</p>
                <p className="font-medium">{terapeuta.ciudad || "No especificada"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Departamento</p>
                <p className="font-medium">{terapeuta.departamento || "No especificada"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información Profesional */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Información Profesional</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Briefcase className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Licencia</p>
                    <p className="font-medium">{terapeuta.noLicencia}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Título Académico</p>
                  <p className="font-medium">{terapeuta.tituloAcademico}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Años de Experiencia</p>
                  <p className="font-medium">{terapeuta.añosExperiencia} años</p>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Fecha de Contratación</p>
                  <p className="font-medium">
                    {terapeuta.fechaContratacion
                      ? new Date(terapeuta.fechaContratacion).toLocaleDateString()
                      : "No especificada"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <p className="font-medium">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        terapeuta.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {terapeuta.activo ? "Activo" : "Inactivo"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Especialidad */}
        {especialidad && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Especialidad</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Award className="text-purple-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium">{especialidad.nombre}</p>
                </div>
              </div>
              {especialidad.descripcion && (
                <div>
                  <p className="text-sm text-gray-500">Descripción</p>
                  <p className="font-medium">{especialidad.descripcion}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {terapeuta.idEspecialidad && !especialidad && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Especialidad</h3>
            <p className="text-gray-600">ID de especialidad: {terapeuta.idEspecialidad} (no se pudo cargar la información)</p>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <Calendar className="text-blue-600" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Citas Programadas</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <Briefcase className="text-green-600" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pacientes Atendidos</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <Award className="text-purple-600" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Horarios Disponibles</h3>
              <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
