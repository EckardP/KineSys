
import { useState, useEffect, useCallback } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  crearDisponibilidad,
  obtenerDisponibilidadPorTerapeuta,
  eliminarDisponibilidad,
} from "../../../services/disponibilidadTerapeutaService"

export default function HorariosModal({ terapeuta, onClose }) {
  const [horarios, setHorarios] = useState([])
  const [nuevoHorario, setNuevoHorario] = useState({
    diaSemana: "",
    horaInicio: "",
    horaFin: "",
    disponible: true,
    tipoAmbiente: "Consultorio",
  })
  const [loading, setLoading] = useState(false)
  const [creando, setCreando] = useState(false)

  const cargarHorarios = useCallback(async () => {
    try {
      setLoading(true)
      const data = await obtenerDisponibilidadPorTerapeuta(terapeuta.id)
      setHorarios(data || [])
    } catch (error) {
      console.error("Error al cargar horarios:", error)
      setHorarios([])
    } finally {
      setLoading(false)
    }
  }, [terapeuta.id])

  useEffect(() => {
    cargarHorarios()
  }, [cargarHorarios])

  const handleHorarioChange = (e) => {
    const { name, value, type, checked } = e.target
    setNuevoHorario({
      ...nuevoHorario,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleAgregarHorario = async () => {
    if (!nuevoHorario.diaSemana || !nuevoHorario.horaInicio || !nuevoHorario.horaFin) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    try {
      setCreando(true)
      const datosHorario = {
        idTerapeuta: terapeuta.id,
        diaSemana: nuevoHorario.diaSemana,
        horaInicio: nuevoHorario.horaInicio,
        horaFin: nuevoHorario.horaFin,
        disponible: nuevoHorario.disponible,
        tipoAmbiente: nuevoHorario.tipoAmbiente,
      }

      await crearDisponibilidad(datosHorario)
      await cargarHorarios()
      setNuevoHorario({
        diaSemana: "",
        horaInicio: "",
        horaFin: "",
        disponible: true,
        tipoAmbiente: "Consultorio",
      })
    } catch (error) {
      console.error("Error al agregar horario:", error)
      alert(error.message || "Error al agregar horario")
    } finally {
      setCreando(false)
    }
  }

  const handleEliminarHorario = async (idHorario) => {
    if (window.confirm("¿Seguro que deseas eliminar este horario?")) {
      try {
        await eliminarDisponibilidad(idHorario)
        await cargarHorarios()
      } catch (error) {
        console.error("Error al eliminar horario:", error)
        alert("Error al eliminar horario")
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              Horarios - {terapeuta.nombres} {terapeuta.apellidos}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded transition-colors">
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Formulario para nuevo horario */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Agregar Nuevo Horario</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="diaSemana" className="text-gray-700">
                  Día de la Semana *
                </Label>
                <Select
                  value={nuevoHorario.diaSemana}
                  onValueChange={(value) => setNuevoHorario({ ...nuevoHorario, diaSemana: value })}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Seleccionar día" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lunes">Lunes</SelectItem>
                    <SelectItem value="Martes">Martes</SelectItem>
                    <SelectItem value="Miércoles">Miércoles</SelectItem>
                    <SelectItem value="Jueves">Jueves</SelectItem>
                    <SelectItem value="Viernes">Viernes</SelectItem>
                    <SelectItem value="Sábado">Sábado</SelectItem>
                    <SelectItem value="Domingo">Domingo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tipoAmbiente" className="text-gray-700">
                  Tipo de Ambiente
                </Label>
                <Select
                  value={nuevoHorario.tipoAmbiente}
                  onValueChange={(value) => setNuevoHorario({ ...nuevoHorario, tipoAmbiente: value })}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Seleccionar ambiente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consultorio">Consultorio</SelectItem>
                    <SelectItem value="Virtual">Virtual</SelectItem>
                    <SelectItem value="Domicilio">Domicilio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="horaInicio" className="text-gray-700">
                  Hora de Inicio *
                </Label>
                <Input
                  type="time"
                  id="horaInicio"
                  name="horaInicio"
                  value={nuevoHorario.horaInicio}
                  onChange={handleHorarioChange}
                  className="border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="horaFin" className="text-gray-700">
                  Hora de Fin *
                </Label>
                <Input
                  type="time"
                  id="horaFin"
                  name="horaFin"
                  value={nuevoHorario.horaFin}
                  onChange={handleHorarioChange}
                  className="border-gray-300"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="disponible"
                    name="disponible"
                    checked={nuevoHorario.disponible}
                    onChange={handleHorarioChange}
                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-400"
                  />
                  <Label htmlFor="disponible" className="text-gray-700 cursor-pointer">
                    Disponible
                  </Label>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleAgregarHorario}
                className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2"
                disabled={creando}
              >
                <Plus size={16} />
                {creando ? "Agregando..." : "Agregar Horario"}
              </Button>
            </div>
          </div>

          {/* Lista de horarios existentes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Horarios Registrados</h3>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-gray-600 mt-2">Cargando horarios...</p>
              </div>
            ) : horarios.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay horarios registrados para este terapeuta</p>
            ) : (
              <div className="space-y-3">
                {horarios.map((horario, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{horario.diaSemana}</div>
                      <div className="text-sm text-gray-600">
                        {horario.horaInicio} - {horario.horaFin} • {horario.tipoAmbiente}
                      </div>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          horario.disponible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {horario.disponible ? "Disponible" : "No disponible"}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEliminarHorario(horario.idDisponibilidad)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <Button onClick={onClose} variant="outline" className="border-gray-300">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
