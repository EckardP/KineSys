// src/pages/GestionCita/CitaDetail.jsx
"use client"

import { ArrowLeft, Edit, Calendar, User, Users, Clock, DollarSign, MapPin } from "lucide-react"

export default function CitaDetail({ cita, onBack, onEdit }) {
  const getEstadoBadge = (estado) => {
    const estados = {
      Pendiente: "bg-yellow-100 text-yellow-800",
      Confirmada: "bg-green-100 text-green-800",
      Cancelada: "bg-red-100 text-red-800",
      Completada: "bg-blue-100 text-blue-800"
    }
    return estados[estado] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver a la lista</span>
        </button>
        <button
          onClick={onEdit}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Edit size={20} />
          <span>Editar Cita</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Detalle de Cita</h1>
              <p className="text-indigo-100">ID: {cita.idCita}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoBadge(cita.estado)}`}>
              {cita.estado || "Pendiente"}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información Principal */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Cita</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha y Hora</p>
                      <p className="font-medium text-gray-900">
                        {cita.fechaHora 
                          ? new Date(cita.fechaHora).toLocaleString() 
                          : "No especificada"
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-500">Duración</p>
                      <p className="font-medium text-gray-900">
                        {cita.duracionProgramadaMin || 0} minutos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-500">Precio</p>
                      <p className="font-medium text-gray-900">
                        ${cita.precioCita || 0}
                      </p>
                    </div>
                  </div>

                  {cita.tipoAtencion && (
                    <div>
                      <p className="text-sm text-gray-500">Tipo de Atención</p>
                      <p className="font-medium text-gray-900">{cita.tipoAtencion}</p>
                    </div>
                  )}

                  {cita.motivo && (
                    <div>
                      <p className="text-sm text-gray-500">Motivo</p>
                      <p className="font-medium text-gray-900">{cita.motivo}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Información de Pago */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Pago</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio de la cita</span>
                    <span className="font-medium">${cita.precioCita || 0}</span>
                  </div>
                  {cita.copago && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Copago</span>
                      <span className="font-medium">${cita.copago}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-indigo-600">
                        ${(cita.precioCita || 0) + (cita.copago || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Relaciones */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Participantes</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Paciente</p>
                      <p className="font-medium text-gray-900">ID: {cita.idPaciente}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Terapeuta</p>
                      <p className="font-medium text-gray-900">ID: {cita.idTerapeuta}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información Adicional */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Adicional</h3>
                <div className="space-y-3">
                  {cita.idSala && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Sala</p>
                        <p className="font-medium text-gray-900">ID: {cita.idSala}</p>
                      </div>
                    </div>
                  )}

                  {cita.idOrdenMedica && (
                    <div>
                      <p className="text-sm text-gray-500">Orden Médica</p>
                      <p className="font-medium text-gray-900">ID: {cita.idOrdenMedica}</p>
                    </div>
                  )}

                  {cita.idAutorizacion && (
                    <div>
                      <p className="text-sm text-gray-500">Autorización</p>
                      <p className="font-medium text-gray-900">ID: {cita.idAutorizacion}</p>
                    </div>
                  )}

                  {cita.idEPS && (
                    <div>
                      <p className="text-sm text-gray-500">EPS</p>
                      <p className="font-medium text-gray-900">ID: {cita.idEPS}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Estados y Confirmación */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado y Confirmación</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confirmada</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      cita.confirmada ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {cita.confirmada ? 'Sí' : 'No'}
                    </span>
                  </div>

                  {cita.checkIn && (
                    <div>
                      <p className="text-sm text-gray-500">Check-In</p>
                      <p className="font-medium text-gray-900">
                        {new Date(cita.checkIn).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {cita.checkOut && (
                    <div>
                      <p className="text-sm text-gray-500">Check-Out</p>
                      <p className="font-medium text-gray-900">
                        {new Date(cita.checkOut).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}