
import { useState, useEffect } from "react"
import { X, Stethoscope, Clock, DollarSign, FileText, Package, Plus, Trash2, AlertCircle, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { crearTratamiento, actualizarTratamiento } from "../../../services/tratamientosService"
import { listarEquipos } from "../../../services/equiposService"
import { listarTratamientos } from "../../../services/tratamientosService"

export default function TratamientoForm({ onSubmit, onCancel, initialData, especialidades }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    idEspecialidad: "0",
    duracionMinutos: 30,
    costoBase: 0,
    indicaciones: "",
    contraindicaciones: "",
    activo: true,
    sesionesRecomendadas: 1,
    frecuenciaRecomendada: "Semanal"
  })

  const [equipos, setEquipos] = useState([])
  const [tratamientosExistentes, setTratamientosExistentes] = useState([])
  const [equiposSeleccionados, setEquiposSeleccionados] = useState([])
  const [equipoSeleccionado, setEquipoSeleccionado] = useState("")
  const [cantidadEquipo, setCantidadEquipo] = useState(1)
  const [loading, setLoading] = useState(false)
  const [cargandoEquipos, setCargandoEquipos] = useState(false)
  const [errorEspecialidad, setErrorEspecialidad] = useState("")
  const [, setErrorCantidad] = useState("")

  // Cargar equipos disponibles y tratamientos existentes
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargandoEquipos(true)
        const [equiposData, tratamientosData] = await Promise.all([
          listarEquipos(),
          listarTratamientos()
        ])
        setEquipos(equiposData || [])
        setTratamientosExistentes(tratamientosData || [])
      } catch (error) {
        console.error("Error cargando datos:", error)
      } finally {
        setCargandoEquipos(false)
      }
    }

    cargarDatos()
  }, [])

  // Cargar datos iniciales para edición
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        idEspecialidad: initialData.idEspecialidad?.toString() || "0",
        duracionMinutos: initialData.duracionMinutos || 30,
        costoBase: initialData.costoBase || 0,
        indicaciones: initialData.indicaciones || "",
        contraindicaciones: initialData.contraindicaciones || "",
        activo: initialData.activo !== undefined ? initialData.activo : true,
        sesionesRecomendadas: initialData.sesionesRecomendadas || 1,
        frecuenciaRecomendada: initialData.frecuenciaRecomendada || "Semanal"
      })

      // Cargar equipos si estamos editando
      if (initialData.tratamientoEquipos && initialData.tratamientoEquipos.length > 0) {
        setEquiposSeleccionados(initialData.tratamientoEquipos.map(te => ({
          idEquipo: te.idEquipo || te.equipo?.idEquipo,
          equipo: te.equipo,
          cantidadRequerida: te.cantidadRequerida
        })))
      }
    }
  }, [initialData])

  // Calcular disponibilidad real considerando otros tratamientos
  const calcularDisponibilidadReal = (idEquipo) => {
    const equipo = equipos.find(e => e.idEquipo === idEquipo)
    if (!equipo) return 0

    // Sumar todas las cantidades usadas en otros tratamientos (excluyendo el actual si estamos editando)
    const cantidadUsadaEnOtrosTratamientos = tratamientosExistentes
      .filter(tratamiento => initialData ? tratamiento.id !== initialData.id : true) // Excluir el tratamiento actual en edición
      .reduce((total, tratamiento) => {
        const equiposTratamiento = tratamiento.tratamientoEquipos || []
        const equipoEnTratamiento = equiposTratamiento.find(te => 
          te.idEquipo === idEquipo || te.equipo?.idEquipo === idEquipo
        )
        return total + (equipoEnTratamiento?.cantidadRequerida || 0)
      }, 0)

    const disponibilidadReal = equipo.cantidad - cantidadUsadaEnOtrosTratamientos
    return Math.max(0, disponibilidadReal) // No puede ser negativo
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleEspecialidadChange = (value) => {
    setFormData(prev => ({ ...prev, idEspecialidad: value }))
    // Limpiar error cuando el usuario selecciona una especialidad
    if (value !== "0") {
      setErrorEspecialidad("")
    }
  }

  // Validar cantidad cuando cambia el equipo seleccionado o la cantidad
  useEffect(() => {
    if (equipoSeleccionado && cantidadEquipo > 0) {
      const equipoId = parseInt(equipoSeleccionado)
      const disponibilidadReal = calcularDisponibilidadReal(equipoId)
      
      if (cantidadEquipo > disponibilidadReal) {
        setErrorCantidad(`⚠️ Advertencia: La cantidad solicitada (${cantidadEquipo}) supera las unidades disponibles (${disponibilidadReal})`)
      } else {
        setErrorCantidad("")
      }
    } else {
      setErrorCantidad("")
    }
  }, [equipoSeleccionado, cantidadEquipo, equipos, tratamientosExistentes])

  const agregarEquipo = () => {
    if (!equipoSeleccionado) {
      alert("Selecciona un equipo")
      return
    }

    const equipoId = parseInt(equipoSeleccionado)
    const equipo = equipos.find(e => e.idEquipo === equipoId)
    const disponibilidadReal = calcularDisponibilidadReal(equipoId)

    // Validar cantidad antes de agregar
    if (cantidadEquipo > disponibilidadReal) {
      const confirmar = window.confirm(
        `⚠️ ADVERTENCIA:\n\nLa cantidad solicitada (${cantidadEquipo}) supera las unidades disponibles (${disponibilidadReal}).\n\n¿Desea continuar de todas formas?`
      )
      if (!confirmar) {
        return
      }
    }

    const equipoExistente = equiposSeleccionados.find(e => e.idEquipo === equipoId)
    if (equipoExistente) {
      alert("Este equipo ya fue agregado al tratamiento")
      return
    }

    if (equipo) {
      setEquiposSeleccionados(prev => [...prev, {
        idEquipo: equipo.idEquipo,
        equipo: equipo,
        cantidadRequerida: cantidadEquipo,
        disponibilidadReal: disponibilidadReal // Guardar la disponibilidad al momento de agregar
      }])

      // Resetear el formulario de equipo
      setEquipoSeleccionado("")
      setCantidadEquipo(1)
      setErrorCantidad("")
    }
  }

  const removerEquipo = (idEquipo) => {
    setEquiposSeleccionados(prev => prev.filter(e => e.idEquipo !== idEquipo))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.nombre.trim()) {
      alert("El nombre del tratamiento es obligatorio")
      return
    }

    // 🔥 VALIDACIÓN MEJORADA: Verificar que se haya seleccionado una especialidad válida
    if (formData.idEspecialidad === "0") {
      setErrorEspecialidad("Por favor, selecciona una especialidad para el tratamiento")
      return
    }

    // Validar si hay equipos con cantidad excedida antes de enviar
    const equiposConExceso = equiposSeleccionados.filter(te => {
      const disponibilidadActual = calcularDisponibilidadReal(te.idEquipo)
      return te.cantidadRequerida > disponibilidadActual
    })

    if (equiposConExceso.length > 0) {
      const equiposList = equiposConExceso.map(te => {
        const disponibilidadActual = calcularDisponibilidadReal(te.idEquipo)
        return `- ${te.equipo.nombreEquipo}: Solicitado ${te.cantidadRequerida}, Disponible ${disponibilidadActual}`
      }).join('\n')
      
      const confirmar = window.confirm(
        `⚠️ ADVERTENCIA:\n\nLos siguientes equipos tienen cantidad solicitada mayor a la disponible:\n\n${equiposList}\n\n¿Desea continuar de todas formas?`
      )
      
      if (!confirmar) {
        return
      }
    }

    setLoading(true)
    try {
      // 🔥 PREPARAR LOS EQUIPOS EN EL FORMATO CORRECTO (sin notas)
      const tratamientoEquipos = equiposSeleccionados.map(te => ({
        idEquipo: te.idEquipo,
        cantidadRequerida: te.cantidadRequerida
      }))

      const datosTratamiento = {
        // Para actualización, NO incluir el ID aquí - va en la URL
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        duracionMinutos: parseInt(formData.duracionMinutos) || 30,
        costoBase: parseFloat(formData.costoBase) || 0,
        indicaciones: formData.indicaciones.trim(),
        contraindicaciones: formData.contraindicaciones.trim(),
        activo: Boolean(formData.activo),
        sesionesRecomendadas: parseInt(formData.sesionesRecomendadas) || 1,
        frecuenciaRecomendada: formData.frecuenciaRecomendada,
        
        // Manejar especialidad - ya validamos que no es "0"
        idEspecialidad: parseInt(formData.idEspecialidad),

        // 🔥 INCLUIR LOS EQUIPOS EN EL PAYLOAD (sin notas)
        tratamientoEquipos: tratamientoEquipos
      }

      console.log('📋 Datos finales para enviar:', datosTratamiento)
      console.log('🔧 Equipos a enviar:', tratamientoEquipos)

      let tratamientoGuardado
      if (initialData) {
        tratamientoGuardado = await actualizarTratamiento(initialData.id, datosTratamiento)
      } else {
        tratamientoGuardado = await crearTratamiento(datosTratamiento)
      }

      console.log('✅ Tratamiento guardado:', tratamientoGuardado)
      onSubmit(tratamientoGuardado || datosTratamiento)
    } catch (error) {
      console.error("Error al guardar tratamiento:", error)
      alert(error.message || "Error al guardar el tratamiento")
    } finally {
      setLoading(false)
    }
  }

  const equipoDisponible = equipos.find(e => e.idEquipo === parseInt(equipoSeleccionado))
  const disponibilidadReal = equipoDisponible ? calcularDisponibilidadReal(equipoDisponible.idEquipo) : 0

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-blue-600" />
          {initialData ? "Editar Tratamiento" : "Registrar Nuevo Tratamiento"}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded transition-colors">
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Información Básica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre" className="text-gray-700">Nombre del Tratamiento *</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Terapia de Rehabilitación"
                className="border-gray-300"
                required
              />
            </div>
            <div>
              <Label htmlFor="idEspecialidad" className="text-gray-700 flex items-center gap-1">
                Especialidad *
                {errorEspecialidad && (
                  <AlertCircle size={14} className="text-red-500" />
                )}
              </Label>
              <Select
                value={formData.idEspecialidad}
                onValueChange={handleEspecialidadChange}
              >
                <SelectTrigger className={`border-gray-300 ${errorEspecialidad ? 'border-red-500 bg-red-50' : ''}`}>
                  <SelectValue placeholder="Seleccionar especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0" disabled>
                    Selecciona una especialidad
                  </SelectItem>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp.id} value={esp.id.toString()}>
                      {esp.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errorEspecialidad && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errorEspecialidad}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                * Campo requerido. Selecciona la especialidad a la que pertenece este tratamiento.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="descripcion" className="text-gray-700">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              placeholder="Descripción detallada del tratamiento..."
              className="border-gray-300"
            />
          </div>
        </div>

        {/* Configuración de Sesiones */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Configuración de Sesiones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="duracionMinutos" className="text-gray-700">Duración (minutos)</Label>
              <Input
                id="duracionMinutos"
                name="duracionMinutos"
                type="number"
                value={formData.duracionMinutos}
                onChange={handleChange}
                min="5"
                max="240"
                className="border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="sesionesRecomendadas" className="text-gray-700">Sesiones Recomendadas</Label>
              <Input
                id="sesionesRecomendadas"
                name="sesionesRecomendadas"
                type="number"
                value={formData.sesionesRecomendadas}
                onChange={handleChange}
                min="1"
                max="50"
                className="border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="frecuenciaRecomendada" className="text-gray-700">Frecuencia</Label>
              <Select
                value={formData.frecuenciaRecomendada}
                onValueChange={(value) => setFormData(prev => ({ ...prev, frecuenciaRecomendada: value }))}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Diaria">Diaria</SelectItem>
                  <SelectItem value="Semanal">Semanal</SelectItem>
                  <SelectItem value="Quincenal">Quincenal</SelectItem>
                  <SelectItem value="Mensual">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Equipos Utilizados */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-600" />
            Equipos Utilizados
          </h3>
          
          {/* Selector de Equipos */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <Label htmlFor="equipoSeleccionado" className="text-gray-700">Seleccionar Equipo</Label>
                <Select
                  value={equipoSeleccionado}
                  onValueChange={setEquipoSeleccionado}
                  disabled={cargandoEquipos}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder={cargandoEquipos ? "Cargando equipos..." : "Seleccionar equipo"} />
                  </SelectTrigger>
                  <SelectContent>
                    {equipos.map((equipo) => {
                      const disponibilidad = calcularDisponibilidadReal(equipo.idEquipo)
                      return (
                        <SelectItem key={equipo.idEquipo} value={equipo.idEquipo.toString()}>
                          <div className="flex justify-between items-center w-full">
                            <span>{equipo.nombreEquipo}</span>
                            <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                              equipo.estado === 'Disponible' ? 'bg-green-100 text-green-800' :
                              equipo.estado === 'En Mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {disponibilidad} disp.
                            </span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="cantidadEquipo" className="text-gray-700">Cantidad</Label>
                <Input
                  id="cantidadEquipo"
                  type="number"
                  min="1"
                  value={cantidadEquipo}
                  onChange={(e) => setCantidadEquipo(parseInt(e.target.value) || 1)}
                  className="border-gray-300"
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={agregarEquipo}
                  disabled={!equipoSeleccionado}
                  className="bg-orange-600 hover:bg-orange-700 text-white w-full"
                >
                  <Plus size={16} className="mr-1" />
                  Agregar
                </Button>
              </div>
            </div>

            {equipoDisponible && (
              <div className="mt-2 text-sm text-gray-600">
                <p><strong>Stock total:</strong> {equipoDisponible.cantidad} unidades</p>
                <p><strong>Disponible real:</strong> {disponibilidadReal} unidades</p>
                <p><strong>Ubicación:</strong> {equipoDisponible.ubicacion || "No especificada"}</p>
                
                {/* Mostrar advertencia si la cantidad solicitada excede la disponible */}
                {cantidadEquipo > disponibilidadReal && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-800 text-sm flex items-center gap-1">
                      <AlertTriangle size={14} />
                      <strong>Advertencia:</strong> La cantidad solicitada ({cantidadEquipo}) supera las unidades disponibles ({disponibilidadReal})
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lista de Equipos Seleccionados */}
          {equiposSeleccionados.length > 0 ? (
            <div className="space-y-2">
              <Label className="text-gray-700">Equipos seleccionados ({equiposSeleccionados.length}):</Label>
              {equiposSeleccionados.map((item) => {
                const disponibilidadActual = calcularDisponibilidadReal(item.idEquipo)
                const tieneExceso = item.cantidadRequerida > disponibilidadActual
                return (
                  <div 
                    key={item.idEquipo} 
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      tieneExceso 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{item.equipo.nombreEquipo}</p>
                        {tieneExceso && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">
                            <AlertTriangle size={12} className="mr-1" />
                            Exceso
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.cantidadRequerida} | 
                        Disponible: {disponibilidadActual} |
                        Estado: <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${
                          item.equipo.estado === 'Disponible' ? 'bg-green-100 text-green-800' :
                          item.equipo.estado === 'En Mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.equipo.estado}
                        </span>
                      </p>
                      {tieneExceso && (
                        <p className="text-sm text-yellow-700 mt-1">
                          ⚠️ Solicitado: {item.cantidadRequerida} | Disponible real: {disponibilidadActual}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removerEquipo(item.idEquipo)}
                      className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors ml-2"
                      title="Remover equipo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <Package size={32} className="mx-auto mb-2 text-gray-400" />
              <p>No se han agregado equipos a este tratamiento</p>
            </div>
          )}
        </div>

        {/* Información Económica */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Información Económica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="costoBase" className="text-gray-700">Costo Base ($)</Label>
              <Input
                id="costoBase"
                name="costoBase"
                type="number"
                step="0.01"
                value={formData.costoBase}
                onChange={handleChange}
                min="0"
                className="border-gray-300"
              />
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="activo"
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="activo" className="text-gray-700 cursor-pointer">
                Tratamiento Activo
              </Label>
            </div>
          </div>
        </div>

        {/* Información Técnica */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Información Técnica
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="indicaciones" className="text-gray-700">Indicaciones</Label>
              <Textarea
                id="indicaciones"
                name="indicaciones"
                value={formData.indicaciones}
                onChange={handleChange}
                rows={3}
                placeholder="Indicaciones para el paciente..."
                className="border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="contraindicaciones" className="text-gray-700">Contraindicaciones</Label>
              <Textarea
                id="contraindicaciones"
                name="contraindicaciones"
                value={formData.contraindicaciones}
                onChange={handleChange}
                rows={2}
                placeholder="Contraindicaciones y precauciones..."
                className="border-gray-300"
              />
            </div>
          </div>
        </div>

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
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              initialData ? "Actualizar Tratamiento" : "Guardar Tratamiento"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
