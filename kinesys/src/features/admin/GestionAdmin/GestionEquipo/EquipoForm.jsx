
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import EquipoBasicInfo from "./EquipoBasicInfo"
import EquipoStatusInfo from "./EquipoStatusInfo"
import { crearEquipo, actualizarEquipo } from "@/services/equiposService"

export default function EquipoForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    nombreEquipo: "",
    descripcion: "",
    estado: "Disponible",
    cantidad: 1,
    ubicacion: "",
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      console.log("📥 Cargando datos iniciales para edición:", initialData)
      setFormData({
        nombreEquipo: initialData.nombreEquipo || "",
        descripcion: initialData.descripcion || "",
        estado: initialData.estado || "Disponible",
        cantidad: initialData.cantidad || 1,
        ubicacion: initialData.ubicacion || "",
      })
    } else {
      setFormData({
        nombreEquipo: "",
        descripcion: "",
        estado: "Disponible",
        cantidad: 1,
        ubicacion: "",
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
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
    if (!formData.nombreEquipo.trim()) {
      alert("Por favor ingrese el nombre del equipo")
      return
    }

    if (formData.cantidad < 1) {
      alert("La cantidad debe ser al menos 1")
      return
    }

    console.log("✅ Todas las validaciones pasaron")

    setLoading(true)

    try {
      const datosEquipo = {
        nombreEquipo: formData.nombreEquipo,
        descripcion: formData.descripcion,
        estado: formData.estado,
        cantidad: formData.cantidad,
        ubicacion: formData.ubicacion,
      }

      if (initialData) {
        await actualizarEquipo(initialData.idEquipo, datosEquipo)
      } else {
        await crearEquipo(datosEquipo)
      }

      console.log("🎉 Equipo guardado correctamente")
      onSubmit() // Esto recargará la lista y cerrará el formulario
    } catch (error) {
      console.error("❌ Error en handleSubmit:", error)
      alert(error.message || "Error al guardar el equipo")
    } finally {
      setLoading(false)
    }
  }

  console.log("🔍 Estado actual de formData:", formData)

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? "Editar Equipo" : "Registrar Nuevo Equipo"}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded transition-colors">
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica del Equipo */}
        <EquipoBasicInfo
          formData={formData}
          onChange={handleChange}
        />

        {/* Estado y Ubicación */}
        <EquipoStatusInfo
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
              initialData ? "Actualizar" : "Guardar Equipo"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
