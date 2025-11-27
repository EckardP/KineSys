"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SalaBasicInfo({ formData, onChange, onSelectChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Información Básica de la Sala</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre" className="text-gray-700">
            Nombre de la Sala *
          </Label>
          <Input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={onChange}
            placeholder="Ej: Sala de Terapia 1"
            className="border-gray-300"
            required
          />
        </div>
        <div>
          <Label htmlFor="tipo" className="text-gray-700">
            Tipo de Sala *
          </Label>
          <Select
            value={formData.tipo}
            onValueChange={(value) => onSelectChange("tipo", value)}
          >
            <SelectTrigger className="border-gray-300">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Consulta">Consulta</SelectItem>
              <SelectItem value="Terapia">Terapia</SelectItem>
              <SelectItem value="Rehabilitación">Rehabilitación</SelectItem>
              <SelectItem value="Quirófano">Quirófano</SelectItem>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Especializada">Especializada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="capacidad" className="text-gray-700">
            Capacidad
          </Label>
          <Input
            id="capacidad"
            name="capacidad"
            type="number"
            min="1"
            value={formData.capacidad}
            onChange={onChange}
            placeholder="Número de personas"
            className="border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="ubicacion" className="text-gray-700">
            Ubicación
          </Label>
          <Input
            id="ubicacion"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={onChange}
            placeholder="Ej: Primer piso, Ala este"
            className="border-gray-300"
          />
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="descripcion" className="text-gray-700">
          Descripción
        </Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={onChange}
          placeholder="Descripción de la sala, equipamiento disponible, características especiales..."
          className="border-gray-300 min-h-[100px]"
          rows={3}
        />
      </div>
    </div>
  )
}