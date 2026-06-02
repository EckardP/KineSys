
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EquipoStatusInfo({ formData, onChange, onSelectChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Estado y Ubicación</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="estado" className="text-gray-700">
            Estado
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
              <SelectItem value="En Mantenimiento">En Mantenimiento</SelectItem>
              <SelectItem value="Dañado">Dañado</SelectItem>
            </SelectContent>
          </Select>
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
            placeholder="Ej: Consultorio 1, Almacén, etc."
            className="border-gray-300"
          />
        </div>
      </div>
    </div>
  )
}
