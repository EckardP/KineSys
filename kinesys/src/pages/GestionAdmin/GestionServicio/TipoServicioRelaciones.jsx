"use client"

import { useState } from "react"
import { Plus, Trash2, Star, Package, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TipoServicioRelaciones({
  especialidades,
  equipos,
  especialidadesSeleccionadas,
  equiposSeleccionados,
  onAgregarEspecialidad,
  onEliminarEspecialidad,
  onToggleEspecialidadObligatoria,
  onAgregarEquipo,
  onEliminarEquipo,
  onActualizarCantidadEquipo,
  onToggleEquipoObligatorio,
  loadingRelaciones
}) {
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("")
  const [esObligatoriaEspecialidad, setEsObligatoriaEspecialidad] = useState(true)
  const [equipoSeleccionado, setEquipoSeleccionado] = useState("")
  const [cantidadEquipo, setCantidadEquipo] = useState(1)
  const [esObligatorioEquipo, setEsObligatorioEquipo] = useState(true)

  const handleAgregarEspecialidad = () => {
    if (!especialidadSeleccionada) {
      alert("Por favor seleccione una especialidad")
      return
    }

    const especialidad = especialidades.find(esp => esp.id.toString() === especialidadSeleccionada)
    if (especialidad) {
      onAgregarEspecialidad(especialidad, esObligatoriaEspecialidad)
      setEspecialidadSeleccionada("")
    }
  }

  const handleAgregarEquipo = () => {
    if (!equipoSeleccionado) {
      alert("Por favor seleccione un equipo")
      return
    }

    const equipo = equipos.find(eq => eq.idEquipo.toString() === equipoSeleccionado)
    if (equipo) {
      onAgregarEquipo(equipo, cantidadEquipo, esObligatorioEquipo)
      setEquipoSeleccionado("")
      setCantidadEquipo(1)
    }
  }

  if (loadingRelaciones) {
    return (
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Relaciones del Servicio</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-600 mt-2">Cargando relaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-900">Relaciones del Servicio</h3>

      {/* Especialidades Requeridas */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Especialidades Requeridas
          </h4>
        </div>

        {/* Formulario para agregar especialidad */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="especialidad" className="text-gray-700">
                Seleccionar Especialidad
              </Label>
              <Select value={especialidadSeleccionada} onValueChange={setEspecialidadSeleccionada}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Seleccionar especialidad" />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp.id} value={esp.id.toString()}>
                      {esp.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="esObligatoriaEspecialidad"
                checked={esObligatoriaEspecialidad}
                onChange={(e) => setEsObligatoriaEspecialidad(e.target.checked)}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-400"
              />
              <Label htmlFor="esObligatoriaEspecialidad" className="text-gray-700 cursor-pointer">
                Es obligatoria
              </Label>
            </div>

            <div>
              <Button
                type="button"
                onClick={handleAgregarEspecialidad}
                className="bg-gray-900 hover:bg-gray-800 text-white w-full"
                disabled={!especialidadSeleccionada}
              >
                <Plus size={16} className="mr-2" />
                Agregar Especialidad
              </Button>
            </div>
          </div>
        </div>

        {/* Lista de especialidades seleccionadas */}
        <div className="space-y-2">
          {especialidadesSeleccionadas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No se han agregado especialidades</p>
          ) : (
            especialidadesSeleccionadas.map((especialidad) => (
              <div key={especialidad.idEspecialidad} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900">{especialidad.nombre}</span>
                  <button
                    onClick={() => onToggleEspecialidadObligatoria(especialidad.idEspecialidad)}
                    className={`p-1 rounded ${
                      especialidad.esObligatoria 
                        ? 'text-yellow-500 hover:bg-yellow-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={especialidad.esObligatoria ? "Obligatoria" : "Opcional"}
                  >
                    <Star size={16} fill={especialidad.esObligatoria ? "currentColor" : "none"} />
                  </button>
                  <span className={`text-xs px-2 py-1 rounded ${
                    especialidad.esObligatoria 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {especialidad.esObligatoria ? "Obligatoria" : "Opcional"}
                  </span>
                </div>
                <button
                  onClick={() => onEliminarEspecialidad(especialidad.idEspecialidad)}
                  className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Equipos Requeridos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            Equipos Requeridos
          </h4>
        </div>

        {/* Formulario para agregar equipo */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="equipo" className="text-gray-700">
                Seleccionar Equipo
              </Label>
              <Select value={equipoSeleccionado} onValueChange={setEquipoSeleccionado}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Seleccionar equipo" />
                </SelectTrigger>
                <SelectContent>
                  {equipos.map((equipo) => (
                    <SelectItem key={equipo.idEquipo} value={equipo.idEquipo.toString()}>
                      {equipo.nombreEquipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="cantidadEquipo" className="text-gray-700">
                Cantidad
              </Label>
              <Input
                id="cantidadEquipo"
                type="number"
                min="1"
                value={cantidadEquipo}
                onChange={(e) => setCantidadEquipo(Number(e.target.value))}
                className="border-gray-300"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="esObligatorioEquipo"
                checked={esObligatorioEquipo}
                onChange={(e) => setEsObligatorioEquipo(e.target.checked)}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-400"
              />
              <Label htmlFor="esObligatorioEquipo" className="text-gray-700 cursor-pointer">
                Es obligatorio
              </Label>
            </div>

            <div>
              <Button
                type="button"
                onClick={handleAgregarEquipo}
                className="bg-gray-900 hover:bg-gray-800 text-white w-full"
                disabled={!equipoSeleccionado}
              >
                <Plus size={16} className="mr-2" />
                Agregar Equipo
              </Button>
            </div>
          </div>
        </div>

        {/* Lista de equipos seleccionados */}
        <div className="space-y-2">
          {equiposSeleccionados.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No se han agregado equipos</p>
          ) : (
            equiposSeleccionados.map((equipo) => (
              <div key={equipo.idEquipo} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4 flex-1">
                  <span className="font-medium text-gray-900 flex-1">{equipo.nombreEquipo}</span>
                  
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`cantidad-${equipo.idEquipo}`} className="text-sm text-gray-600 whitespace-nowrap">
                      Cantidad:
                    </Label>
                    <Input
                      id={`cantidad-${equipo.idEquipo}`}
                      type="number"
                      min="1"
                      value={equipo.cantidadRequerida}
                      onChange={(e) => onActualizarCantidadEquipo(equipo.idEquipo, Number(e.target.value))}
                      className="w-20 border-gray-300"
                    />
                  </div>

                  <button
                    onClick={() => onToggleEquipoObligatorio(equipo.idEquipo)}
                    className={`p-1 rounded ${
                      equipo.esObligatorio 
                        ? 'text-yellow-500 hover:bg-yellow-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={equipo.esObligatorio ? "Obligatorio" : "Opcional"}
                  >
                    <Star size={16} fill={equipo.esObligatorio ? "currentColor" : "none"} />
                  </button>
                  
                  <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                    equipo.esObligatorio 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {equipo.esObligatorio ? "Obligatorio" : "Opcional"}
                  </span>
                </div>
                
                <button
                  onClick={() => onEliminarEquipo(equipo.idEquipo)}
                  className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors ml-4"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Resumen de relaciones */}
      {(especialidadesSeleccionadas.length > 0 || equiposSeleccionados.length > 0) && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Resumen de Relaciones</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <strong>Especialidades:</strong> {especialidadesSeleccionadas.length} 
              ({especialidadesSeleccionadas.filter(esp => esp.esObligatoria).length} obligatorias, 
              {especialidadesSeleccionadas.filter(esp => !esp.esObligatoria).length} opcionales)
            </div>
            <div>
              <strong>Equipos:</strong> {equiposSeleccionados.length} 
              ({equiposSeleccionados.filter(eq => eq.esObligatorio).length} obligatorios, 
              {equiposSeleccionados.filter(eq => !eq.esObligatorio).length} opcionales)
            </div>
          </div>
        </div>
      )}
    </div>
  )
}