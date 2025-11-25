"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import TerapeutaPersonalInfo from "./TerapeutaPersonalInfo"
import TerapeutaContactInfo from "./TerapeutaContactInfo"
import TerapeutaEspecialidad from "./TerapeutaEspecialidad"
import TerapeutaProfessionalInfo from "./TerapeutaProfessionalInfo"
import TerapeutaAccessInfo from "./TerapeutaAccessInfo"
import { crearTerapeuta, actualizarTerapeuta } from "../../../services/terapeutasService"

const formatDateForInput = (dateString) => {
  if (!dateString) return ""

  if (typeof dateString === "string" && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString
  }

  if (typeof dateString === "string" && dateString.includes("T")) {
    return dateString.split("T")[0]
  }

  if (dateString instanceof Date) {
    return dateString.toISOString().split("T")[0]
  }

  return ""
}

export default function TerapeutaForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    user: "",
    password: "",
    nombres: "",
    apellidos: "",
    tipoDocumento: "",
    documentoIdentidad: "",
    telefono: "",
    celular: "",
    correoElectronico: "",
    fechaNacimiento: "",
    genero: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    noLicencia: "",
    tituloAcademico: "",
    añosExperiencia: "",
    fechaContratacion: "",
    idEspecialidad: "",
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      console.log("📥 Cargando datos iniciales para edición:", initialData)

      const formattedData = {
        ...initialData,
        user: initialData.user || "",
        password: "", // Siempre vacío en edición por seguridad
        fechaNacimiento: formatDateForInput(initialData.fechaNacimiento),
        fechaContratacion: formatDateForInput(initialData.fechaContratacion),
        idEspecialidad: initialData.idEspecialidad || "",
        telefono: initialData.telefono || "",
        celular: initialData.celular || "",
        direccion: initialData.direccion || "",
        ciudad: initialData.ciudad || "",
        departamento: initialData.departamento || "",
        añosExperiencia: initialData.añosExperiencia || "",
      }

      console.log("📤 Datos formateados:", formattedData)
      setFormData(formattedData)
    } else {
      // Limpiar formulario completamente al crear nuevo
      setFormData({
        user: "",
        password: "",
        nombres: "",
        apellidos: "",
        tipoDocumento: "",
        documentoIdentidad: "",
        telefono: "",
        celular: "",
        correoElectronico: "",
        fechaNacimiento: "",
        genero: "",
        direccion: "",
        ciudad: "",
        departamento: "",
        noLicencia: "",
        tituloAcademico: "",
        añosExperiencia: "",
        fechaContratacion: "",
        idEspecialidad: "",
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    if (!formData.user || !formData.nombres || !formData.apellidos || !formData.tipoDocumento || !formData.documentoIdentidad) {
      console.log("❌ Validación fallida: Campos obligatorios incompletos")
      alert("Por favor complete los campos obligatorios (Usuario, Nombres, Apellidos, Tipo Documento y Documento)")
      return
    }

    if (!initialData && !formData.password) {
      console.log("❌ Validación fallida: Contraseña requerida para nuevo terapeuta")
      alert("Por favor ingrese una contraseña para el nuevo terapeuta")
      return
    }

    if (!formData.noLicencia || !formData.tituloAcademico) {
      console.log("❌ Validación fallida: Campos profesionales incompletos")
      alert("Por favor complete los campos de información profesional")
      return
    }

    console.log("✅ Todas las validaciones pasaron")

    setLoading(true)

    try {
      const datosTerapeuta = {
        user: formData.user,
        password: formData.password, // Usar la contraseña ingresada manualmente
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        tipoDocumento: formData.tipoDocumento,
        documentoIdentidad: formData.documentoIdentidad,
        telefono: formData.telefono,
        celular: formData.celular,
        correoElectronico: formData.correoElectronico,
        fechaNacimiento: formData.fechaNacimiento ? new Date(formData.fechaNacimiento).toISOString() : null,
        genero: formData.genero,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        departamento: formData.departamento,
        activo: true,
        fechaRegistro: new Date().toISOString(),
        rol: 2,
        noLicencia: formData.noLicencia,
        tituloAcademico: formData.tituloAcademico,
        añosExperiencia: Number(formData.añosExperiencia) || 0,
        fechaContratacion: formData.fechaContratacion ? new Date(formData.fechaContratacion).toISOString() : new Date().toISOString(),
        idEspecialidad: formData.idEspecialidad ? Number(formData.idEspecialidad) : null,
      }

      if (initialData) {
        // Para actualizar, no envíes password si está vacío (no se quiere cambiar)
        const { password, fechaRegistro, rol, ...datosActualizacion } = datosTerapeuta
        // Si se ingresó una nueva contraseña, incluirla en la actualización
        const datosParaActualizar = formData.password 
          ? { ...datosActualizacion, password: formData.password }
          : datosActualizacion
        
        await actualizarTerapeuta(initialData.id, datosParaActualizar)
      } else {
        await crearTerapeuta(datosTerapeuta)
      }

      console.log("🎉 Terapeuta guardado correctamente")
      onSubmit() // Esto recargará la lista y cerrará el formulario
    } catch (error) {
      console.error("❌ Error en handleSubmit:", error)
      alert(error.message || "Error al guardar el terapeuta")
    } finally {
      setLoading(false)
    }
  }

  console.log("🔍 Estado actual de formData:", formData)

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? "Editar Terapeuta" : "Registrar Nuevo Terapeuta"}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded transition-colors">
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información de Acceso */}
        <TerapeutaAccessInfo
          formData={formData}
          onChange={handleChange}
          isEditing={!!initialData}
        />

        {/* Información Personal */}
        <TerapeutaPersonalInfo
          formData={formData}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
        />

        {/* Información de Contacto */}
        <TerapeutaContactInfo
          formData={formData}
          onChange={handleChange}
        />

        {/* Especialidad */}
        <TerapeutaEspecialidad
          formData={formData}
          onSelectChange={handleSelectChange}
        />

        {/* Información Profesional */}
        <TerapeutaProfessionalInfo
          formData={formData}
          onChange={handleChange}
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
              initialData ? "Actualizar" : "Guardar Terapeuta"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}