"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function TipoServicioBasicInfo({ formData, onChange, onSelectChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Información Básica del Servicio</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="nombreServicio" className="text-gray-700">
            Nombre del Servicio *
          </Label>
          <Input
            id="nombreServicio"
            name="nombreServicio"
            value={formData.nombreServicio}
            onChange={onChange}
            placeholder="Ej: Rehabilitación postquirúrgica"
            className="border-gray-300"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="descripcion" className="text-gray-700">
            Descripción
          </Label>
          <Textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={onChange}
            placeholder="Descripción detallada del servicio y sus beneficios"
            className="border-gray-300 min-h-[100px]"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="duracionEstandarMin" className="text-gray-700">
            Duración Estándar (minutos) *
          </Label>
          <Input
            id="duracionEstandarMin"
            name="duracionEstandarMin"
            type="number"
            min="1"
            value={formData.duracionEstandarMin}
            onChange={onChange}
            className="border-gray-300"
            required
          />
        </div>

        <div>
          <Label htmlFor="tipoSalaNecesaria" className="text-gray-700">
            Tipo de Sala Requerida
          </Label>
          <select
            id="tipoSalaNecesaria"
            name="tipoSalaNecesaria"
            value={formData.tipoSalaNecesaria}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="General">General</option>
            <option value="Consulta">Consulta</option>
            <option value="Terapia">Terapia</option>
            <option value="Rehabilitación">Rehabilitación</option>
            <option value="Quirófano">Quirófano</option>
            <option value="Especializada">Especializada</option>
          </select>
        </div>

        <div>
          <Label htmlFor="precio" className="text-gray-700">
            Precio ($)
          </Label>
          <Input
            id="precio"
            name="precio"
            type="number"
            min="0"
            step="0.01"
            value={formData.precio}
            onChange={onChange}
            className="border-gray-300"
          />
        </div>

        <div>
          <Label htmlFor="documentosNecesarios" className="text-gray-700">
            Documentos Necesarios
          </Label>
          <Input
            id="documentosNecesarios"
            name="documentosNecesarios"
            value={formData.documentosNecesarios}
            onChange={onChange}
            placeholder="Ej: Orden médica, Exámenes previos"
            className="border-gray-300"
          />
        </div>
      </div>
    </div>
  )
}