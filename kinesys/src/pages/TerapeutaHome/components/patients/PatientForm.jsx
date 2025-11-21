"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PatientForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      cedula: "",
      nombres: "",
      apellidos: "",
      fechaNacimiento: "",
      genero: "",
      telefono: "",
      celular: "",
      email: "",
      direccion: "",
      ciudad: "",
      departamento: "",
      eps: "",
      numeroAfiliacion: "",
      alergias: "",
      antecedentes: "",
    },
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.cedula || !formData.nombres || !formData.apellidos) {
      alert("Por favor complete los campos obligatorios")
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{initialData ? "Editar Paciente" : "Registrar Nuevo Paciente"}</h2>
        <button onClick={onCancel} className="p-2 hover:bg-muted rounded">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cedula">Cédula *</Label>
              <Input
                id="cedula"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                placeholder="1234567890"
              />
            </div>
            <div>
              <Label htmlFor="nombres">Nombres *</Label>
              <Input id="nombres" name="nombres" value={formData.nombres} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="apellidos">Apellidos *</Label>
              <Input id="apellidos" name="apellidos" value={formData.apellidos} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <Label htmlFor="fechaNacimiento">Fecha Nacimiento</Label>
              <Input
                id="fechaNacimiento"
                name="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="genero">Género</Label>
              <Select
                name="genero"
                value={formData.genero}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, genero: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Femenino</SelectItem>
                  <SelectItem value="O">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" type="tel" value={formData.telefono} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="celular">Celular</Label>
              <Input id="celular" name="celular" type="tel" value={formData.celular} onChange={handleChange} />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="direccion">Dirección</Label>
            <Input id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="departamento">Departamento</Label>
              <Input id="departamento" name="departamento" value={formData.departamento} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Información de Aseguramiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eps">EPS</Label>
              <Input id="eps" name="eps" value={formData.eps} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="numeroAfiliacion">Número de Afiliación</Label>
              <Input
                id="numeroAfiliacion"
                name="numeroAfiliacion"
                value={formData.numeroAfiliacion}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Información Médica</h3>
          <div>
            <Label htmlFor="alergias">Alergias y Medicamentos</Label>
            <Textarea
              id="alergias"
              name="alergias"
              value={formData.alergias}
              onChange={handleChange}
              rows={3}
              placeholder="Descripción de alergias..."
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="antecedentes">Antecedentes Patológicos</Label>
            <Textarea
              id="antecedentes"
              name="antecedentes"
              value={formData.antecedentes}
              onChange={handleChange}
              rows={3}
              placeholder="Antecedentes médicos relevantes..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{initialData ? "Actualizar" : "Guardar"}</Button>
        </div>
      </form>
    </div>
  )
}
