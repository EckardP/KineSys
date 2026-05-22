
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import TipoServicioBasicInfo from "./TipoServicioBasicInfo"
import TipoServicioConfigInfo from "./TipoServicioConfigInfo"
import TipoServicioRelaciones from "./TipoServicioRelaciones"
import { crearTipoServicio, actualizarTipoServicio } from "../../../services/tipoServiciosService"
import { 
  obtenerEspecialidadesPorTipoServicio, 
  agregarEspecialidadATipoServicio, 
} from "../../../services/tipoServicioEspecialidadesService"
import { 
  obtenerEquiposRequeridosPorTipoServicio, 
  crearEquipoRequerido, 
} from "../../../services/equiposRequeridosService"
import { listarEspecialidades } from "../../../services/especialidadesService"
import { listarEquipos } from "../../../services/equiposService"

export default function TipoServicioForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    nombreServicio: "",
    descripcion: "",
    duracionEstandarMin: 30,
    tipoSalaNecesaria: "General",
    precio: 0,
    compatibleConEPS: true,
    compatibleConPrepagadas: true,
    documentosNecesarios: "",
  })

  const [especialidades, setEspecialidades] = useState([])
  const [equipos, setEquipos] = useState([])
  const [especialidadesSeleccionadas, setEspecialidadesSeleccionadas] = useState([])
  const [equiposSeleccionados, setEquiposSeleccionados] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingRelaciones, setLoadingRelaciones] = useState(false)

  // Cargar datos iniciales y relaciones existentes
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      if (initialData) {
        console.log("📥 Cargando datos iniciales para edición:", initialData)
        setFormData({
          nombreServicio: initialData.nombreServicio || "",
          descripcion: initialData.descripcion || "",
          duracionEstandarMin: initialData.duracionEstandarMin || 30,
          tipoSalaNecesaria: initialData.tipoSalaNecesaria || "General",
          precio: initialData.precio || 0,
          compatibleConEPS: initialData.compatibleConEPS !== undefined ? initialData.compatibleConEPS : true,
          compatibleConPrepagadas: initialData.compatibleConPrepagadas !== undefined ? initialData.compatibleConPrepagadas : true,
          documentosNecesarios: initialData.documentosNecesarios || "",
        })

        // Cargar relaciones existentes si estamos editando
        if (initialData.idTipoServicio) {
          await cargarRelacionesExistentes(initialData.idTipoServicio)
        }
      } else {
        setFormData({
          nombreServicio: "",
          descripcion: "",
          duracionEstandarMin: 30,
          tipoSalaNecesaria: "General",
          precio: 0,
          compatibleConEPS: true,
          compatibleConPrepagadas: true,
          documentosNecesarios: "",
        })
      }
    }

    cargarDatosIniciales()
    cargarEspecialidades()
    cargarEquipos()
  }, [initialData])

  const cargarEspecialidades = async () => {
    try {
      const especialidadesData = await listarEspecialidades()
      setEspecialidades(especialidadesData || [])
    } catch (error) {
      console.error("Error cargando especialidades:", error)
    }
  }

  const cargarEquipos = async () => {
    try {
      const equiposData = await listarEquipos()
      setEquipos(equiposData || [])
    } catch (error) {
      console.error("Error cargando equipos:", error)
    }
  }

  const cargarRelacionesExistentes = async (idTipoServicio) => {
    setLoadingRelaciones(true)
    try {
      // Cargar especialidades existentes
      const especialidadesRelaciones = await obtenerEspecialidadesPorTipoServicio(idTipoServicio)
      setEspecialidadesSeleccionadas(especialidadesRelaciones || [])

      // Cargar equipos existentes
      const equiposRelaciones = await obtenerEquiposRequeridosPorTipoServicio(idTipoServicio)
      setEquiposSeleccionados(equiposRelaciones || [])
    } catch (error) {
      console.error("Error cargando relaciones existentes:", error)
    } finally {
      setLoadingRelaciones(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : 
              type === 'select-one' ? value : value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejo de especialidades
  const agregarEspecialidad = (especialidad, esObligatoria = true) => {
    if (!especialidadesSeleccionadas.find(esp => esp.idEspecialidad === especialidad.id)) {
      setEspecialidadesSeleccionadas(prev => [...prev, {
        idEspecialidad: especialidad.id,
        nombre: especialidad.nombre,
        esObligatoria
      }])
    }
  }

  const eliminarEspecialidad = (idEspecialidad) => {
    setEspecialidadesSeleccionadas(prev => 
      prev.filter(esp => esp.idEspecialidad !== idEspecialidad)
    )
  }

  const toggleEspecialidadObligatoria = (idEspecialidad) => {
    setEspecialidadesSeleccionadas(prev =>
      prev.map(esp =>
        esp.idEspecialidad === idEspecialidad
          ? { ...esp, esObligatoria: !esp.esObligatoria }
          : esp
      )
    )
  }

  // Manejo de equipos
  const agregarEquipo = (equipo, cantidadRequerida = 1, esObligatorio = true) => {
    if (!equiposSeleccionados.find(eq => eq.idEquipo === equipo.idEquipo)) {
      setEquiposSeleccionados(prev => [...prev, {
        idEquipo: equipo.idEquipo,
        nombreEquipo: equipo.nombreEquipo,
        cantidadRequerida,
        esObligatorio
      }])
    }
  }

  const eliminarEquipo = (idEquipo) => {
    setEquiposSeleccionados(prev => 
      prev.filter(eq => eq.idEquipo !== idEquipo)
    )
  }

  const actualizarCantidadEquipo = (idEquipo, nuevaCantidad) => {
    setEquiposSeleccionados(prev =>
      prev.map(eq =>
        eq.idEquipo === idEquipo
          ? { ...eq, cantidadRequerida: nuevaCantidad }
          : eq
      )
    )
  }

  const toggleEquipoObligatorio = (idEquipo) => {
    setEquiposSeleccionados(prev =>
      prev.map(eq =>
        eq.idEquipo === idEquipo
          ? { ...eq, esObligatorio: !eq.esObligatorio }
          : eq
      )
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("🔄 handleSubmit: Iniciando envío del formulario...")

    // Validaciones básicas
    if (!formData.nombreServicio.trim()) {
      alert("Por favor ingrese el nombre del servicio")
      return
    }

    if (formData.duracionEstandarMin <= 0) {
      alert("La duración estándar debe ser mayor a 0")
      return
    }

    if (formData.precio < 0) {
      alert("El precio no puede ser negativo")
      return
    }

    console.log("✅ Todas las validaciones pasaron")

    setLoading(true)

    try {
      let idTipoServicio

      if (initialData) {
        // Actualizar servicio existente
        await actualizarTipoServicio(initialData.idTipoServicio, formData)
        idTipoServicio = initialData.idTipoServicio

        // Eliminar y recrear relaciones (estrategia simple)
        await gestionarRelaciones(idTipoServicio)
      } else {
        // Crear nuevo servicio
        const nuevoServicio = await crearTipoServicio(formData)
        idTipoServicio = nuevoServicio.idTipoServicio

        // Crear relaciones
        await gestionarRelaciones(idTipoServicio)
      }

      console.log("🎉 Servicio guardado correctamente")
      onSubmit()
    } catch (error) {
      console.error("❌ Error en handleSubmit:", error)
      alert(error.message || "Error al guardar el servicio")
    } finally {
      setLoading(false)
    }
  }

  const gestionarRelaciones = async (idTipoServicio) => {
    // Gestionar especialidades
    for (const especialidad of especialidadesSeleccionadas) {
      await agregarEspecialidadATipoServicio(
        idTipoServicio,
        especialidad.idEspecialidad,
        especialidad.esObligatoria
      )
    }

    // Gestionar equipos
    for (const equipo of equiposSeleccionados) {
      await crearEquipoRequerido({
        idTipoServicio,
        idEquipo: equipo.idEquipo,
        cantidadRequerida: equipo.cantidadRequerida,
        esObligatorio: equipo.esObligatorio
      })
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? "Editar Servicio" : "Registrar Nuevo Servicio"}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded transition-colors">
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica del Servicio */}
        <TipoServicioBasicInfo
          formData={formData}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
        />

        {/* Configuración del Servicio */}
        <TipoServicioConfigInfo
          formData={formData}
          onChange={handleChange}
        />

        {/* Relaciones con Especialidades y Equipos */}
        <TipoServicioRelaciones
          especialidades={especialidades}
          equipos={equipos}
          especialidadesSeleccionadas={especialidadesSeleccionadas}
          equiposSeleccionados={equiposSeleccionados}
          onAgregarEspecialidad={agregarEspecialidad}
          onEliminarEspecialidad={eliminarEspecialidad}
          onToggleEspecialidadObligatoria={toggleEspecialidadObligatoria}
          onAgregarEquipo={agregarEquipo}
          onEliminarEquipo={eliminarEquipo}
          onActualizarCantidadEquipo={actualizarCantidadEquipo}
          onToggleEquipoObligatorio={toggleEquipoObligatorio}
          loadingRelaciones={loadingRelaciones}
        />

        {/* Botones de acción */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-gray-900 hover:bg-gray-800 text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {initialData ? "Actualizando..." : "Guardando..."}
              </>
            ) : (
              initialData ? "Actualizar" : "Guardar Servicio"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
