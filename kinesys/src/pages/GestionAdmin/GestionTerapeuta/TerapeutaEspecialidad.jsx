"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { listarEspecialidades, crearEspecialidad } from "../../../services/especialidadesService"

export default function TerapeutaEspecialidad({ formData, onSelectChange }) {
  const [especialidades, setEspecialidades] = useState([])
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false)
  const [showEspecialidadForm, setShowEspecialidadForm] = useState(false)
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState({
    nombre: "",
    descripcion: "",
  })
  const [creandoEspecialidad, setCreandoEspecialidad] = useState(false)

  const cargarEspecialidades = async () => {
    try {
      console.log("🔄 TerapeutaEspecialidad: Ejecutando cargarEspecialidades...")
      setLoadingEspecialidades(true)
      const especialidadesData = await listarEspecialidades()
      console.log("📦 TerapeutaEspecialidad: Datos recibidos de listarEspecialidades:", especialidadesData)

      const especialidadesArray = Array.isArray(especialidadesData) ? especialidadesData : []
      console.log("🎯 TerapeutaEspecialidad: Especialidades a guardar en estado:", especialidadesArray)
      setEspecialidades(especialidadesArray)
    } catch (error) {
      console.error("❌ TerapeutaEspecialidad: Error cargando especialidades:", error)
      setEspecialidades([])
    } finally {
      setLoadingEspecialidades(false)
    }
  }

  useEffect(() => {
    console.log("🚀 TerapeutaEspecialidad: Montando componente, cargando especialidades...")
    cargarEspecialidades()
  }, [])

  const handleEspecialidadChange = (e) => {
    const { name, value } = e.target
    setNuevaEspecialidad((prev) => ({ ...prev, [name]: value }))
  }

  const handleAgregarEspecialidad = async () => {
    if (!nuevaEspecialidad.nombre.trim()) {
      alert("El nombre de la especialidad es requerido")
      return
    }

    setCreandoEspecialidad(true)
    try {
      await crearEspecialidad(nuevaEspecialidad)
      await cargarEspecialidades()
      setNuevaEspecialidad({ nombre: "", descripcion: "" })
      setShowEspecialidadForm(false)
    } catch (error) {
      console.error("Error al crear especialidad:", error)
      alert(error.message || "Error al crear especialidad")
    } finally {
      setCreandoEspecialidad(false)
    }
  }

  const especialidadesValidas = Array.isArray(especialidades)
    ? especialidades.filter((esp) => {
        const tieneId = esp?.id != null && esp.id.toString().trim() !== ""
        const tieneNombre = esp?.nombre && esp.nombre.trim() !== ""
        return tieneId && tieneNombre
      })
    : []

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Especialidad</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowEspecialidadForm(!showEspecialidadForm)}
          className="border-gray-300"
          disabled={creandoEspecialidad}
        >
          <Plus size={16} className="mr-2" />
          {showEspecialidadForm ? "Cancelar" : "Agregar Especialidad"}
        </Button>
      </div>

      {showEspecialidadForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <h4 className="font-medium text-gray-900 mb-3">Nueva Especialidad</h4>
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
      )}

      <div>
        <Label htmlFor="idEspecialidad" className="text-gray-700">
          Seleccionar Especialidad
        </Label>
        <Select
          value={formData.idEspecialidad?.toString() || "0"}
          onValueChange={(value) => onSelectChange("idEspecialidad", value)}
        >
          <SelectTrigger className="border-gray-300">
            <SelectValue placeholder={loadingEspecialidades ? "Cargando..." : "Seleccionar Especialidad"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Sin Especialidad</SelectItem>
            {especialidadesValidas.map((esp) => (
              <SelectItem key={esp.id} value={esp.id.toString()}>
                {esp.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}