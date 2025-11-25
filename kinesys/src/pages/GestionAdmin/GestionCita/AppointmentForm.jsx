"use client"

import { useState } from "react"
import { X } from "lucide-react"

export default function AppointmentForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    paciente: "",
    fecha: "",
    hora: "",
    tipo: "Seguimiento",
    sala: "",
    terapeuta: "",
    observaciones: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.paciente || !formData.fecha || !formData.hora) {
      alert("Por favor complete los campos obligatorios")
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Programar Nueva Cita</h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Paciente *</label>
            <input
              type="text"
              name="paciente"
              value={formData.paciente}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Nombre del paciente"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Terapeuta</label>
            <select
              name="terapeuta"
              value={formData.terapeuta}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Seleccionar terapeuta</option>
              <option value="Dr. López">Dr. López</option>
              <option value="Dra. García">Dra. García</option>
              <option value="Dr. Martínez">Dr. Martínez</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Fecha *</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Hora *</label>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Sala</label>
            <select
              name="sala"
              value={formData.sala}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Seleccionar sala</option>
              <option value="1">Sala 1</option>
              <option value="2">Sala 2</option>
              <option value="3">Sala 3</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Tipo de Cita</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="Inicial">Inicial</option>
            <option value="Seguimiento">Seguimiento</option>
            <option value="Control">Control</option>
            <option value="Evolución">Evolución</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Observaciones</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            rows="3"
            placeholder="Observaciones adicionales..."
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
            Programar Cita
          </button>
        </div>
      </form>
    </div>
  )
}
