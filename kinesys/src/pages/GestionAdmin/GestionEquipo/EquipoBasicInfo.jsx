"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function EquipoBasicInfo({ formData, onChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Información Básica del Equipo</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombreEquipo" className="text-gray-700">
            Nombre del Equipo *
          </Label>
          <Input
            id="nombreEquipo"
            name="nombreEquipo"
            value={formData.nombreEquipo}
            onChange={onChange}
            placeholder="Ej: Camilla de masajes"
            className="border-gray-300"
            required
          />
        </div>
        <div>
          <Label htmlFor="cantidad" className="text-gray-700">
            Cantidad *
          </Label>
          <Input
            id="cantidad"
            name="cantidad"
            type="number"
            min="1"
            value={formData.cantidad}
            onChange={onChange}
            className="border-gray-300"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="descripcion" className="text-gray-700">
          Descripción
        </Label>
        <Input
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={onChange}
          placeholder="Descripción del equipo y su uso"
          className="border-gray-300"
        />
      </div>
    </div>
  )
}