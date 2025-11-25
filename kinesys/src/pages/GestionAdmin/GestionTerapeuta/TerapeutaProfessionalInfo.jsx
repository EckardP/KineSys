"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TerapeutaProfessionalInfo({ formData, onChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Información Profesional</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="noLicencia" className="text-gray-700">
            Número de Licencia *
          </Label>
          <Input
            id="noLicencia"
            name="noLicencia"
            value={formData.noLicencia}
            onChange={onChange}
            placeholder="Número de licencia profesional"
            className="border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="tituloAcademico" className="text-gray-700">
            Título Académico *
          </Label>
          <Input
            id="tituloAcademico"
            name="tituloAcademico"
            value={formData.tituloAcademico}
            onChange={onChange}
            placeholder="Ej: Lic. en Fisioterapia"
            className="border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="añosExperiencia" className="text-gray-700">
            Años de Experiencia
          </Label>
          <Input
            id="añosExperiencia"
            name="añosExperiencia"
            type="number"
            value={formData.añosExperiencia}
            onChange={onChange}
            placeholder="0"
            min="0"
            className="border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="fechaContratacion" className="text-gray-700">
            Fecha de Contratación
          </Label>
          <Input
            id="fechaContratacion"
            name="fechaContratacion"
            type="date"
            value={formData.fechaContratacion || ""}
            onChange={onChange}
            className="border-gray-300"
          />
        </div>
      </div>
    </div>
  )
}