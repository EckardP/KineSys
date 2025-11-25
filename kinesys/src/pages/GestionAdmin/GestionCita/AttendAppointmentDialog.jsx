"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export default function AttendAppointmentDialog({ appointment, onClose, onComplete }) {
  const [formData, setFormData] = useState({
    diagnostico: "",
    tratamientoRealizado: "",
    observaciones: "",
    progreso: "",
    proximaCita: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.diagnostico || !formData.tratamientoRealizado) {
      alert("Por favor complete los campos obligatorios")
      return
    }
    onComplete(appointment.id, formData.diagnostico, formData.progreso)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-xl rounded-lg">
        <DialogHeader className="bg-gray-50 px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">Atender Cita - {appointment.paciente}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
            <div>
              <p className="text-sm text-gray-600">Paciente</p>
              <p className="font-semibold text-gray-900">{appointment.paciente}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tipo de Cita</p>
              <p className="font-semibold text-gray-900">{appointment.tipo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha</p>
              <p className="font-semibold text-gray-900">{appointment.fecha}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hora</p>
              <p className="font-semibold text-gray-900">{appointment.hora}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnostico" className="text-gray-700 font-medium">
              Diagnóstico / Evaluación *
            </Label>
            <Textarea
              id="diagnostico"
              name="diagnostico"
              value={formData.diagnostico}
              onChange={handleChange}
              rows={3}
              placeholder="Descripción del diagnóstico o evaluación realizada..."
              required
              className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tratamientoRealizado" className="text-gray-700 font-medium">
              Tratamiento Realizado *
            </Label>
            <Textarea
              id="tratamientoRealizado"
              name="tratamientoRealizado"
              value={formData.tratamientoRealizado}
              onChange={handleChange}
              rows={3}
              placeholder="Detalle del tratamiento y técnicas aplicadas..."
              required
              className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="progreso" className="text-gray-700 font-medium">
              Progreso del Paciente
            </Label>
            <Input
              id="progreso"
              name="progreso"
              value={formData.progreso}
              onChange={handleChange}
              placeholder="Ej: 80% mejoría, estable, sin cambios..."
              className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones" className="text-gray-700 font-medium">
              Observaciones Adicionales
            </Label>
            <Textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={2}
              placeholder="Cualquier observación relevante..."
              className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proximaCita" className="text-gray-700 font-medium">
              Próxima Cita (Opcional)
            </Label>
            <Input
              id="proximaCita"
              name="proximaCita"
              type="date"
              value={formData.proximaCita}
              onChange={handleChange}
              className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
            />
          </div>

          <DialogFooter className="bg-gray-50 px-6 py-4 border-t mt-6">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white">
                Completar Cita
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
