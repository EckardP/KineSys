
import { useState, useEffect, useCallback } from "react"
import { Plus, Edit, Trash2, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { listarEspecialidades, crearEspecialidad } from "../../../services/especialidadesService"
import { agregarEspecialidadATerapeuta, eliminarRelacionPorIds, obtenerEspecialidadesPorTerapeuta } from "../../../services/terapeutaEspecialidadesService"

export default function GestionarEspecialidadesTerapeuta({ idTerapeuta }) {
  const [especialidades, setEspecialidades] = useState([])
  const [especialidadesAsignadas, setEspecialidadesAsignadas] = useState([])
  const [loading, setLoading] = useState(false)
  const [showEspecialidadForm, setShowEspecialidadForm] = useState(false)
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState({
    nombre: "",
    descripcion: "",
  })
  const [creandoEspecialidad, setCreandoEspecialidad] = useState(false)
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("0")
  const [datosCertificacion, setDatosCertificacion] = useState({
    fechaCertificacion: new Date().toISOString().split('T')[0],
    numeroCertificado: "",
    esPrincipal: false
  })
  const [agregandoEspecialidad, setAgregandoEspecialidad] = useState(false)

  // Cargar especialidades disponibles y asignadas
  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true)
      console.log("🔄 Cargando especialidades disponibles y asignadas...")
      
      // Cargar especialidades disponibles
      const especialidadesData = await listarEspecialidades()
      console.log("📦 Especialidades disponibles:", especialidadesData)
      const especialidadesArray = Array.isArray(especialidadesData) ? especialidadesData : []
      setEspecialidades(especialidadesArray)

      // Cargar especialidades asignadas al terapeuta
      if (idTerapeuta) {
        console.log("🔍 Obteniendo especialidades para terapeuta ID:", idTerapeuta)
        const asignadasData = await obtenerEspecialidadesPorTerapeuta(idTerapeuta)
        console.log("📦 Especialidades asignadas:", asignadasData)
        const asignadasArray = Array.isArray(asignadasData) ? asignadasData : []
        setEspecialidadesAsignadas(asignadasArray)
      } else {
        console.log("ℹ️ No hay ID de terapeuta, no se pueden cargar especialidades asignadas")
        setEspecialidadesAsignadas([])
      }
    } catch (error) {
      console.error("❌ Error cargando datos:", error)
    } finally {
      setLoading(false)
    }
  }, [idTerapeuta])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  // Manejar cambios en el formulario de nueva especialidad
  const handleEspecialidadChange = (e) => {
    const { name, value } = e.target
    setNuevaEspecialidad((prev) => ({ ...prev, [name]: value }))
  }

  // Manejar cambios en los datos de certificación
  const handleCertificacionChange = (e) => {
    const { name, value, type, checked } = e.target
    setDatosCertificacion(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Crear nueva especialidad
  const handleAgregarEspecialidad = async () => {
    if (!nuevaEspecialidad.nombre.trim()) {
      alert("El nombre de la especialidad es requerido")
      return
    }

    setCreandoEspecialidad(true)
    try {
      await crearEspecialidad(nuevaEspecialidad)
      await cargarDatos()
      setNuevaEspecialidad({ nombre: "", descripcion: "" })
      setShowEspecialidadForm(false)
    } catch (error) {
      console.error("Error al crear especialidad:", error)
      alert(error.message || "Error al crear especialidad")
    } finally {
      setCreandoEspecialidad(false)
    }
  }

  // Agregar especialidad al terapeuta
  const handleAgregarEspecialidadTerapeuta = async () => {
    if (especialidadSeleccionada === "0" || !idTerapeuta) {
      alert("Seleccione una especialidad válida")
      return
    }

    setAgregandoEspecialidad(true)
    try {
      await agregarEspecialidadATerapeuta(idTerapeuta, parseInt(especialidadSeleccionada), datosCertificacion)
      await cargarDatos()
      setEspecialidadSeleccionada("0")
      setDatosCertificacion({
        fechaCertificacion: new Date().toISOString().split('T')[0],
        numeroCertificado: "",
        esPrincipal: false
      })
      alert("Especialidad agregada correctamente")
    } catch (error) {
      console.error("Error al agregar especialidad al terapeuta:", error)
      alert(error.message || "Error al agregar especialidad")
    } finally {
      setAgregandoEspecialidad(false)
    }
  }

  // Eliminar especialidad del terapeuta
  const handleEliminarEspecialidad = async (idEspecialidad) => {
    if (!window.confirm("¿Está seguro de eliminar esta especialidad del terapeuta?")) {
      return
    }

    try {
      await eliminarRelacionPorIds(idTerapeuta, idEspecialidad)
      await cargarDatos()
      alert("Especialidad eliminada correctamente")
    } catch (error) {
      console.error("Error al eliminar especialidad:", error)
      alert(error.message || "Error al eliminar especialidad")
    }
  }

  // Filtrar especialidades disponibles (no asignadas)
  const especialidadesDisponibles = especialidades.filter(esp => 
    !especialidadesAsignadas.some(asignada => asignada.idEspecialidad === esp.id)
  )

  console.log("🔍 Estado actual del componente:")
  console.log("- Especialidades disponibles:", especialidadesDisponibles)
  console.log("- Especialidades asignadas:", especialidadesAsignadas)
  console.log("- ID Terapeuta:", idTerapeuta)

  return (
    <div className="space-y-6">
      {/* Mensaje si no hay terapeuta seleccionado */}
      {!idTerapeuta && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            <strong>Nota:</strong> Debe guardar el terapeuta primero para poder asignar especialidades.
          </p>
        </div>
      )}

      {/* Formulario para agregar nueva especialidad */}
      <div className="border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Agregar Nueva Especialidad</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowEspecialidadForm(!showEspecialidadForm)}
              disabled={creandoEspecialidad}
            >
              <Plus size={16} className="mr-2" />
              {showEspecialidadForm ? "Cancelar" : "Nueva Especialidad"}
            </Button>
          </div>
        </div>

        {showEspecialidadForm && (
          <div className="p-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Crear Nueva Especialidad</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre" className="text-gray-700">
                    Nombre de la Especialidad *
                  </Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={nuevaEspecialidad.nombre}
                    onChange={handleEspecialidadChange}
                    placeholder="Ingrese el nombre de la especialidad"
                    className="border-gray-300"
                    disabled={creandoEspecialidad}
                  />
                </div>
                <div>
                  <Label htmlFor="descripcion" className="text-gray-700">
                    Descripción
                  </Label>
                  <Input
                    id="descripcion"
                    name="descripcion"
                    value={nuevaEspecialidad.descripcion}
                    onChange={handleEspecialidadChange}
                    placeholder="Descripción de la especialidad"
                    className="border-gray-300"
                    disabled={creandoEspecialidad}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEspecialidadForm(false)
                    setNuevaEspecialidad({ nombre: "", descripcion: "" })
                  }}
                  className="border-gray-300"
                  disabled={creandoEspecialidad}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleAgregarEspecialidad}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                  disabled={creandoEspecialidad}
                >
                  {creandoEspecialidad ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    "Guardar Especialidad"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Agregar especialidad existente al terapeuta - SOLO SI HAY TERAPEUTA */}
      {idTerapeuta && (
        <div className="border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Agregar Especialidad al Terapeuta</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <Label htmlFor="especialidadSeleccionada" className="text-gray-700">
                Seleccionar Especialidad
              </Label>
              <Select
                value={especialidadSeleccionada}
                onValueChange={setEspecialidadSeleccionada}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder={loading ? "Cargando..." : "Seleccionar Especialidad"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Seleccionar especialidad</SelectItem>
                  {especialidadesDisponibles.map((esp) => (
                    <SelectItem key={esp.id} value={esp.id.toString()}>
                      {esp.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {especialidadSeleccionada !== "0" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <Label htmlFor="fechaCertificacion" className="text-gray-700">
                    Fecha de Certificación
                  </Label>
                  <Input
                    type="date"
                    id="fechaCertificacion"
                    name="fechaCertificacion"
                    value={datosCertificacion.fechaCertificacion}
                    onChange={handleCertificacionChange}
                    className="border-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="numeroCertificado" className="text-gray-700">
                    Número de Certificado
                  </Label>
                  <Input
                    id="numeroCertificado"
                    name="numeroCertificado"
                    value={datosCertificacion.numeroCertificado}
                    onChange={handleCertificacionChange}
                    placeholder="Número de certificado"
                    className="border-gray-300"
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="esPrincipal"
                      name="esPrincipal"
                      checked={datosCertificacion.esPrincipal}
                      onChange={handleCertificacionChange}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="esPrincipal" className="text-gray-700">
                      Especialidad Principal
                    </Label>
                  </div>
                  <Button
                    onClick={handleAgregarEspecialidadTerapeuta}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={agregandoEspecialidad}
                  >
                    {agregandoEspecialidad ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Agregando...
                      </>
                    ) : (
                      <>
                        <Check size={16} className="mr-2" />
                        Agregar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lista de especialidades asignadas - SOLO SI HAY TERAPEUTA */}
      {idTerapeuta && (
        <div className="border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Especialidades del Terapeuta
              <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs">
                {especialidadesAsignadas.length}
              </span>
            </h3>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando especialidades...</p>
              </div>
            ) : especialidadesAsignadas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay especialidades asignadas al terapeuta
              </div>
            ) : (
              <div className="space-y-3">
                {especialidadesAsignadas.map((relacion) => {
                  // Buscar la especialidad en el listado general
                  const especialidad = especialidades.find(esp => esp.id === relacion.idEspecialidad)
                  
                  return (
                    <div key={relacion.idTerapeutaEspecialidad} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900">
                            {especialidad?.nombre || `Especialidad ID: ${relacion.idEspecialidad}`}
                          </h4>
                          {relacion.esPrincipal && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Principal
                            </span>
                          )}
                        </div>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Certificado:</span> {relacion.numeroCertificado || "No especificado"}
                          </div>
                          <div>
                            <span className="font-medium">Fecha:</span> {new Date(relacion.fechaCertificacion).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Estado:</span> {relacion.esPrincipal ? "Principal" : "Secundaria"}
                          </div>
                        </div>
                        {especialidad?.descripcion && (
                          <p className="mt-2 text-sm text-gray-500">{especialidad.descripcion}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEliminarEspecialidad(relacion.idEspecialidad)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
