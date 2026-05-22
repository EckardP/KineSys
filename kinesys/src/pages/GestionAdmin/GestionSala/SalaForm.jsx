
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import SalaBasicInfo from "./SalaBasicInfo"
import SalaStatusInfo from "./SalaStatusInfo"
import { crearSala, actualizarSala } from "../../../services/salasService"

export default function SalaForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "Consulta",
    estado: "Disponible",
    capacidad: "",
    ubicacion: "",
    descripcion: "",
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      console.log("📥 Cargando datos iniciales para edición:", initialData)
      setFormData({
        nombre: initialData.nombre || "",
        tipo: initialData.tipo || "Consulta",
        estado: initialData.estado || "Disponible",
        capacidad: initialData.capacidad || "",
        ubicacion: initialData.ubicacion || "",
        descripcion: initialData.descripcion || "",
      })
    } else {
      setFormData({
        nombre: "",
        tipo: "Consulta",
        estado: "Disponible",
        capacidad: "",
        ubicacion: "",
        descripcion: "",
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("🔄 handleSubmit: Iniciando envío del formulario...")

    // Validaciones básicas
    if (!formData.nombre.trim()) {
      alert("Por favor ingrese el nombre de la sala")
      return
    }

    if (formData.capacidad && formData.capacidad < 1) {
      alert("La capacidad debe ser al menos 1")
      return
    }

    console.log("✅ Todas las validaciones pasaron")

    setLoading(true)

    try {
      const datosSala = {
        nombre: formData.nombre,
        tipo: formData.tipo,
        estado: formData.estado,
        capacidad: formData.capacidad || null,
        ubicacion: formData.ubicacion,
        descripcion: formData.descripcion,
      }

      if (initialData) {
        await actualizarSala(initialData.idSala, datosSala)
      } else {
        await crearSala(datosSala)
      }

      console.log("🎉 Sala guardada correctamente")
      onSubmit() // Esto recargará la lista y cerrará el formulario
    } catch (error) {
      console.error("❌ Error en handleSubmit:", error)
      alert(error.message || "Error al guardar la sala")
    } finally {
      setLoading(false)
    }
  }

  console.log("🔍 Estado actual de formData:", formData)

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? "Editar Sala" : "Registrar Nueva Sala"}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded transition-colors">
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica de la Sala */}
        <SalaBasicInfo
          formData={formData}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
        />

        {/* Estado y Ubicación */}
        <SalaStatusInfo
          formData={formData}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
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
              initialData ? "Actualizar" : "Guardar Sala"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
