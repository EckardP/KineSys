"use client"

import { ArrowLeft, Users, MapPin, Building, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SalaDetail({ sala, onBack }) {
  console.log("📋 SalaDetail: Datos de la sala:", sala)

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="ghost" className="flex items-center space-x-2">
        <ArrowLeft size={20} />
        <span>Volver</span>
      </Button>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{sala.nombre}</h1>
            <p className="text-gray-600 mt-1">ID: {sala.idSala}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información Básica */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Información de la Sala</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Building className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-medium">{sala.tipo}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Capacidad</p>
                  <p className="font-medium">{sala.capacidad || "No especificada"} personas</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="font-medium">{sala.ubicacion || "No especificada"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Estado */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Estado Actual</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <p className="font-medium">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    sala.estado === 'Disponible' ? 'bg-green-100 text-green-800' :
                    sala.estado === 'Ocupada' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sala.estado}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción */}
        {sala.descripcion && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Descripción</h3>
            <p className="text-gray-700">{sala.descripcion}</p>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <Calendar className="text-blue-600" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Citas del Día</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <Clock className="text-green-600" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Horas Ocupadas</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <Building className="text-purple-600" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Disponibilidad</h3>
              <p className="text-3xl font-bold text-purple-600">
                {sala.estado === 'Disponible' ? '100%' : '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}