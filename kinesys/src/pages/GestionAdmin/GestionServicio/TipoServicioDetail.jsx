
import { ArrowLeft, Clock, MapPin, DollarSign, FileText, Users, Package, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { obtenerEspecialidadesPorTipoServicio } from "../../../services/tipoServicioEspecialidadesService"
import { obtenerEquiposRequeridosPorTipoServicio } from "../../../services/equiposRequeridosService"
import { obtenerEspecialidad } from "../../../services/especialidadesService"
import { obtenerEquipo } from "../../../services/equiposService"

export default function TipoServicioDetail({ tipoServicio, onBack }) {
  const [especialidades, setEspecialidades] = useState([])
  const [equiposRequeridos, setEquiposRequeridos] = useState([])
  const [loading, setLoading] = useState(true)

  console.log("📋 TipoServicioDetail: Datos del servicio:", tipoServicio)

  useEffect(() => {
    const cargarDatosAdicionales = async () => {
      setLoading(true)
      console.log("🔄 TipoServicioDetail: Iniciando carga de datos adicionales...")

      try {
        if (tipoServicio?.idTipoServicio) {
          // Cargar especialidades
          const relacionesEspecialidades = await obtenerEspecialidadesPorTipoServicio(tipoServicio.idTipoServicio)
          const especialidadesCompletas = await Promise.all(
            relacionesEspecialidades.map(async (relacion) => {
              const especialidad = await obtenerEspecialidad(relacion.idEspecialidad)
              return {
                ...especialidad,
                esObligatoria: relacion.esObligatoria
              }
            })
          )
          setEspecialidades(especialidadesCompletas)

          // Cargar equipos requeridos
          const equiposRelaciones = await obtenerEquiposRequeridosPorTipoServicio(tipoServicio.idTipoServicio)
          const equiposCompletos = await Promise.all(
            equiposRelaciones.map(async (relacion) => {
              const equipo = await obtenerEquipo(relacion.idEquipo)
              return {
                ...equipo,
                cantidadRequerida: relacion.cantidadRequerida,
                esObligatorio: relacion.esObligatorio
              }
            })
          )
          setEquiposRequeridos(equiposCompletos)
        }
      } catch (error) {
        console.error("❌ TipoServicioDetail: Error cargando datos adicionales:", error)
      } finally {
        setLoading(false)
      }
    }

    cargarDatosAdicionales()
  }, [tipoServicio?.idTipoServicio])

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

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{tipoServicio.nombreServicio}</h1>
            <p className="text-gray-600 mt-1">ID: {tipoServicio.idTipoServicio}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información Básica */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Información del Servicio</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Duración Estándar</p>
                  <p className="font-medium">{tipoServicio.duracionEstandarMin} minutos</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Tipo de Sala Requerida</p>
                  <p className="font-medium">{tipoServicio.tipoSalaNecesaria}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Precio</p>
                  <p className="font-medium">${tipoServicio.precio?.toLocaleString()}</p>
                </div>
              </div>
              {tipoServicio.documentosNecesarios && (
                <div className="flex items-center space-x-3">
                  <FileText className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Documentos Necesarios</p>
                    <p className="font-medium">{tipoServicio.documentosNecesarios}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compatibilidad */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Compatibilidad</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">EPS</p>
                <p className="font-medium">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tipoServicio.compatibleConEPS ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {tipoServicio.compatibleConEPS ? "Compatible" : "No compatible"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prepagadas</p>
                <p className="font-medium">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tipoServicio.compatibleConPrepagadas ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {tipoServicio.compatibleConPrepagadas ? "Compatible" : "No compatible"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción */}
        {tipoServicio.descripcion && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Descripción</h3>
            <p className="text-gray-700">{tipoServicio.descripcion}</p>
          </div>
        )}

        {/* Especialidades Requeridas */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Especialidades Requeridas ({especialidades.length})
          </h3>
          {especialidades.length === 0 ? (
            <p className="text-gray-500">No se han definido especialidades para este servicio</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {especialidades.map((especialidad) => (
                <div key={especialidad.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">{especialidad.nombre}</span>
                    {especialidad.esObligatoria && (
                      <Star size={16} className="text-yellow-500 fill-current" />
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    especialidad.esObligatoria 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {especialidad.esObligatoria ? "Obligatoria" : "Opcional"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Equipos Requeridos */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            Equipos Requeridos ({equiposRequeridos.length})
          </h3>
          {equiposRequeridos.length === 0 ? (
            <p className="text-gray-500">No se han definido equipos para este servicio</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {equiposRequeridos.map((equipo) => (
                <div key={equipo.idEquipo} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">{equipo.nombreEquipo}</span>
                    {equipo.esObligatorio && (
                      <Star size={16} className="text-yellow-500 fill-current" />
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">Cant: {equipo.cantidadRequerida}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      equipo.esObligatorio 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {equipo.esObligatorio ? "Obligatorio" : "Opcional"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
