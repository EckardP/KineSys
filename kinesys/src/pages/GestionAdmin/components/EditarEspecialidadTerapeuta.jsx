// components/EditarEspecialidadTerapeuta.jsx

import { useState } from "react"
import { Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function EditarEspecialidadTerapeuta({ 
  relacion, 
  onSave, 
  onCancel 
}) {
  const [datosEditados, setDatosEditados] = useState({
    fechaCertificacion: relacion.fechaCertificacion.split('T')[0],
    numeroCertificado: relacion.numeroCertificado || "",
    esPrincipal: relacion.esPrincipal
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setDatosEditados(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = () => {
    onSave({
      ...relacion,
      ...datosEditados,
      fechaCertificacion: new Date(datosEditados.fechaCertificacion).toISOString()
    })
  }

  return (
    <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg mt-2">
      <h5 className="font-medium text-blue-900 mb-3">Editar Especialidad</h5>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="fechaCertificacion" className="text-blue-700">
            Fecha de Certificación
          </Label>
          <Input
            type="date"
            name="fechaCertificacion"
            value={datosEditados.fechaCertificacion}
            onChange={handleChange}
            className="border-blue-300"
          />
        </div>
        <div>
          <Label htmlFor="numeroCertificado" className="text-blue-700">
            Número de Certificado
          </Label>
          <Input
            name="numeroCertificado"
            value={datosEditados.numeroCertificado}
            onChange={handleChange}
            className="border-blue-300"
          />
        </div>
        <div className="flex items-end space-x-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="esPrincipal"
              checked={datosEditados.esPrincipal}
              onChange={handleChange}
              className="rounded border-blue-300"
            />
            <Label htmlFor="esPrincipal" className="text-blue-700">
              Especialidad Principal
            </Label>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="border-blue-300"
        >
          <X size={16} className="mr-1" /> Cancelar
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Save size={16} className="mr-1" /> Guardar
        </Button>
      </div>
    </div>
  )
}
