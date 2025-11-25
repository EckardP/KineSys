"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TerapeutaContactInfo({ formData, onChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Contacto y Ubicación</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="telefono" className="text-gray-700">
            Teléfono
          </Label>
          <Input
            id="telefono"
            name="telefono"
            type="tel"
            value={formData.telefono}
            onChange={onChange}
            className="border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="ciudad" className="text-gray-700">
            Ciudad
          </Label>
          <Input
            id="ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={onChange}
            className="border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="departamento" className="text-gray-700">
            Departamento
          </Label>
          <Input
            id="departamento"
            name="departamento"
            value={formData.departamento}
            onChange={onChange}
            className="border-gray-300"
          />
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="direccion" className="text-gray-700">
          Dirección Completa
        </Label>
        <Input
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={onChange}
          className="border-gray-300"
        />
      </div>
    </div>
  )
}