"use client"

import { useState } from "react"
import { Calendar, Plus, X, Check, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import AppointmentForm from "./AppointmentForm"
import AttendAppointmentDialog from "./AttendAppointmentDialog"

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      paciente: "Juan García",
      fecha: "2024-01-20",
      hora: "09:00",
      tipo: "Inicial",
      estado: "Programada",
      sala: "1",
    },
    {
      id: 2,
      paciente: "María López",
      fecha: "2024-01-20",
      hora: "10:30",
      tipo: "Seguimiento",
      estado: "Programada",
      sala: "2",
    },
    {
      id: 3,
      paciente: "Carlos Rodríguez",
      fecha: "2024-01-19",
      hora: "14:00",
      tipo: "Evolución",
      estado: "Realizada",
      sala: "1",
    },
  ])
  const [showForm, setShowForm] = useState(false)
  const [attendingAppointment, setAttendingAppointment] = useState(null)

  const handleAddAppointment = (newAppointment) => {
    setAppointments([...appointments, { ...newAppointment, id: Date.now(), estado: "Programada" }])
    setShowForm(false)
  }

  const handleDeleteAppointment = (id) => {
    if (confirm("¿Está seguro que desea eliminar esta cita?")) {
      setAppointments(appointments.filter((a) => a.id !== id))
    }
  }

  const handleCompleteAppointment = (id, diagnostico, progreso) => {
    setAppointments(appointments.map((a) => (a.id === id ? { ...a, estado: "Realizada", diagnostico, progreso } : a)))
    setAttendingAppointment(null)
  }

  if (showForm) {
    return <AppointmentForm onSubmit={handleAddAppointment} onCancel={() => setShowForm(false)} />
  }

  const upcomingAppointments = appointments.filter((a) => a.estado === "Programada")
  const completedAppointments = appointments.filter((a) => a.estado === "Realizada")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Citas</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={20} className="mr-2" />
          Nueva Cita
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Citas Programadas</p>
              <p className="text-3xl font-bold text-primary mt-2">{upcomingAppointments.length}</p>
            </div>
            <Calendar className="text-primary opacity-20" size={40} />
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Citas Realizadas</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{completedAppointments.length}</p>
            </div>
            <Check className="text-green-600 opacity-20" size={40} />
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Citas</p>
              <p className="text-3xl font-bold text-secondary mt-2">{appointments.length}</p>
            </div>
            <Clock className="text-secondary opacity-20" size={40} />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-bold">Citas Próximas</h2>
        </div>
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Paciente</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Hora</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Sala</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {upcomingAppointments.map((appt) => (
              <tr key={appt.id} className="border-b hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{appt.paciente}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{appt.fecha}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{appt.hora}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{appt.tipo}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">Sala {appt.sala}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-primary rounded-full text-xs font-medium">
                    {appt.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2 flex items-center">
                  <Button size="sm" variant="outline" onClick={() => setAttendingAppointment(appt)}>
                    Atender
                  </Button>
                  <button
                    onClick={() => handleDeleteAppointment(appt.id)}
                    className="p-2 hover:bg-red-50 text-destructive rounded transition-colors"
                  >
                    <X size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {attendingAppointment && (
        <AttendAppointmentDialog
          appointment={attendingAppointment}
          onClose={() => setAttendingAppointment(null)}
          onComplete={handleCompleteAppointment}
        />
      )}
    </div>
  )
}
