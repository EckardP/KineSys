
import { ArrowLeft, Clock, DollarSign, FileText, Users, Calendar, AlertTriangle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { listarEspecialidades } from "../../../services/especialidadesService"

export default function TratamientoDetail({ tratamiento, onBack }) {
  const [especialidades, setEspecialidades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarEspecialidades = async () => {
      try {
        const data = await listarEspecialidades()
        setEspecialidades(data || [])
      } catch (error) {
        console.error("Error cargando especialidades:", error)
      } finally {
        setLoading(false)
      }
    }

    cargarEspecialidades()
  }, [])

  const getEspecialidadNombre = (idEspecialidad) => {
    const especialidad = especialidades.find(esp => esp.id === idEspecialidad)
    return especialidad?.nombre || "No asignada"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Button onClick={onBack} variant="ghost" className="flex items-center space-x-2">
          <ArrowLeft size={20} />
          <span>Volver</span>
        </Button>
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando información del tratamiento...</p>
        </div>
      </div>
    )
  }

  if (!tratamiento) {
    return (
      <div className="space-y-6">
        <Button onClick={onBack} variant="ghost" className="flex items-center space-x-2">
          <ArrowLeft size={20} />
          <span>Volver</span>
        </Button>
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <p className="text-gray-600">No se encontró información del tratamiento.</p>
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

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{tratamiento.nombre}</h1>
            <p className="text-gray-600 mt-1">{tratamiento.descripcion}</p>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              tratamiento.activo
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {tratamiento.activo ? "Activo" : "Inactivo"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Configuración de Sesiones */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Configuración de Sesiones
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-sm text-gray-600">Duración</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {tratamiento.duracionMinutos || 30} min
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-sm text-gray-600">Sesiones</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {tratamiento.sesionesRecomendadas || 1}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-sm text-gray-600">Frecuencia</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {tratamiento.frecuenciaRecomendada || "Semanal"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-sm text-gray-600">Especialidad</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {getEspecialidadNombre(tratamiento.idEspecialidad)}
                  </p>
                </div>
              </div>
            </div>

            {/* Equipos Utilizados */}
            {tratamiento.tratamientoEquipos && tratamiento.tratamientoEquipos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-600" />
                  Equipos Utilizados
                </h3>
                <div className="space-y-3">
                  {tratamiento.tratamientoEquipos.map((te) => (
                    <div key={te.id} className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{te.equipo?.nombreEquipo}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Cantidad requerida: {te.cantidadRequerida}
                          </p>
                          {te.notas && (
                            <p className="text-sm text-gray-500 mt-1">Notas: {te.notas}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            te.equipo?.estado === 'Disponible' ? 'bg-green-100 text-green-800' :
                            te.equipo?.estado === 'En Mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {te.equipo?.estado || 'No especificado'}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            {te.equipo?.ubicacion || 'Sin ubicación'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Información Económica */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Información Económica
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm text-gray-600">Costo Base</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(tratamiento.costoBase || 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Información Técnica */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Información Técnica
              </h3>
              <div className="space-y-4">
                {tratamiento.indicaciones && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Indicaciones</p>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded border">
                      {tratamiento.indicaciones}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Información Adicional */}
          <div className="space-y-6">
            {/* Contraindicaciones */}
            {tratamiento.contraindicaciones && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-orange-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Contraindicaciones
                </h4>
                <p className="text-sm text-orange-800">{tratamiento.contraindicaciones}</p>
              </div>
            )}

            {/* Estadísticas (placeholder) */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Estadísticas de Uso
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pacientes activos</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sesiones este mes</span>
                  <span className="font-semibold">45</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tasa de éxito</span>
                  <span className="font-semibold text-green-600">85%</span>
                </div>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Acciones</h4>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Programar Sesión
                </Button>
                <Button className="w-full justify-start" variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Generar Reporte
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
