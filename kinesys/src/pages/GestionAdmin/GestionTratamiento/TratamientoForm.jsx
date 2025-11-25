// src/pages/GestionAdmin/GestionTratamiento/TratamientoForm.jsx
"use client"

import { useState, useEffect } from "react"
import { X, Stethoscope, Clock, DollarSign, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { crearTratamiento, actualizarTratamiento } from "../../../services/tratamientosService"

export default function TratamientoForm({ onSubmit, onCancel, initialData, especialidades }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    idEspecialidad: "0", // Cambiar de "" a "0"
    duracionMinutos: 30,
    costoBase: 0,
    materialesRequeridos: "",
    indicaciones: "",
    contraindicaciones: "",
    activo: true,
    sesionesRecomendadas: 1,
    frecuenciaRecomendada: "Semanal"
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        idEspecialidad: initialData.idEspecialidad?.toString() || "0", // Cambiar aquí también
        duracionMinutos: initialData.duracionMinutos || 30,
        costoBase: initialData.costoBase || 0,
        materialesRequeridos: initialData.materialesRequeridos || "",
        indicaciones: initialData.indicaciones || "",
        contraindicaciones: initialData.contraindicaciones || "",
        activo: initialData.activo !== undefined ? initialData.activo : true,
        sesionesRecomendadas: initialData.sesionesRecomendadas || 1,
        frecuenciaRecomendada: initialData.frecuenciaRecomendada || "Semanal"
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.nombre.trim()) {
      alert("El nombre del tratamiento es obligatorio")
      return
    }

    setLoading(true)
    try {
      const datosTratamiento = {
        ...formData,
        duracionMinutos: parseInt(formData.duracionMinutos) || 30,
        costoBase: parseFloat(formData.costoBase) || 0,
        sesionesRecomendadas: parseInt(formData.sesionesRecomendadas) || 1,
        idEspecialidad: formData.idEspecialidad === "0" ? null : parseInt(formData.idEspecialidad) // Convertir "0" a null
      }

      if (initialData) {
        await actualizarTratamiento(initialData.id, datosTratamiento)
      } else {
        await crearTratamiento(datosTratamiento)
      }

      onSubmit(datosTratamiento)
    } catch (error) {
      console.error("Error al guardar tratamiento:", error)
      alert(error.message || "Error al guardar el tratamiento")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-4xl mx-auto">
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
              <Label htmlFor="idEspecialidad" className="text-gray-700">Especialidad</Label>
              <Select
                value={formData.idEspecialidad}
                onValueChange={(value) => setFormData(prev => ({ ...prev, idEspecialidad: value }))}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Seleccionar especialidad" />
                </SelectTrigger>
                <SelectContent>
                  {/* CAMBIAR ESTA LÍNEA: usar "0" en lugar de "" */}
                  <SelectItem value="0">Sin especialidad</SelectItem>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp.id} value={esp.id.toString()}>
                      {esp.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="materialesRequeridos" className="text-gray-700">Materiales Requeridos</Label>
              <Textarea
                id="materialesRequeridos"
                name="materialesRequeridos"
                value={formData.materialesRequeridos}
                onChange={handleChange}
                rows={3}
                placeholder="Lista de materiales necesarios..."
                className="border-gray-300"
              />
            </div>
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
          </div>
          <div className="mt-4">
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