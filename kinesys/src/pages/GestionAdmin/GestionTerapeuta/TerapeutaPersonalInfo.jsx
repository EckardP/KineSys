
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TerapeutaPersonalInfo({ formData, onChange, onSelectChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Información Personal</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="tipoDocumento" className="text-gray-700">
            Tipo Documento *
          </Label>
          <Select
            value={formData.tipoDocumento}
            onValueChange={(value) => onSelectChange("tipoDocumento", value)}
          >
            <SelectTrigger className="border-gray-300">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DNI">DNI</SelectItem>
              <SelectItem value="Cédula">Cédula</SelectItem>
              <SelectItem value="Pasaporte">Pasaporte</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="documentoIdentidad" className="text-gray-700">
            Número Documento *
          </Label>
          <Input
            id="documentoIdentidad"
            name="documentoIdentidad"
            value={formData.documentoIdentidad}
            onChange={onChange}
            placeholder="1234567890"
            className="border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="genero" className="text-gray-700">
            Género
          </Label>
          <Select
            value={formData.genero}
            onValueChange={(value) => onSelectChange("genero", value)}
          >
            <SelectTrigger className="border-gray-300">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Masculino">Masculino</SelectItem>
              <SelectItem value="Femenino">Femenino</SelectItem>
              <SelectItem value="Otro">Otro</SelectItem>
              <SelectItem value="Prefiero no decir">Prefiero no decir</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <Label htmlFor="nombres" className="text-gray-700">
            Nombres *
          </Label>
          <Input
            id="nombres"
            name="nombres"
            value={formData.nombres}
            onChange={onChange}
            className="border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="apellidos" className="text-gray-700">
            Apellidos *
          </Label>
          <Input
            id="apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={onChange}
            className="border-gray-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <Label htmlFor="fechaNacimiento" className="text-gray-700">
            Fecha Nacimiento
          </Label>
          <Input
            id="fechaNacimiento"
            name="fechaNacimiento"
            type="date"
            value={formData.fechaNacimiento || ""}
            onChange={onChange}
            className="border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="correoElectronico" className="text-gray-700">
            Email
          </Label>
          <Input
            id="correoElectronico"
            name="correoElectronico"
            type="email"
            value={formData.correoElectronico}
            onChange={onChange}
            className="border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="celular" className="text-gray-700">
            Celular
          </Label>
          <Input
            id="celular"
            name="celular"
            type="tel"
            value={formData.celular}
            onChange={onChange}
            className="border-gray-300"
          />
        </div>
      </div>
    </div>
  )
}
