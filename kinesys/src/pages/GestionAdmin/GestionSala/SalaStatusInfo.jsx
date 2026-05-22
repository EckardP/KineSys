
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SalaStatusInfo({ formData, onChange: _onChange, onSelectChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Estado de la Sala</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="estado" className="text-gray-700">
            Estado *
          </Label>
          <Select
            value={formData.estado}
            onValueChange={(value) => onSelectChange("estado", value)}
          >
            <SelectTrigger className="border-gray-300">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Disponible">Disponible</SelectItem>
              <SelectItem value="Ocupada">Ocupada</SelectItem>
              <SelectItem value="Mantenimiento">En Mantenimiento</SelectItem>
              <SelectItem value="Limpieza">En Limpieza</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resumen de la sala */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Resumen de la Sala</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
          <div><strong>Nombre:</strong> {formData.nombre || "No especificado"}</div>
          <div><strong>Tipo:</strong> {formData.tipo}</div>
          <div><strong>Estado:</strong> {formData.estado}</div>
          <div><strong>Capacidad:</strong> {formData.capacidad || "No especificada"}</div>
          <div><strong>Ubicación:</strong> {formData.ubicacion || "No especificada"}</div>
        </div>
      </div>
    </div>
  )
}
