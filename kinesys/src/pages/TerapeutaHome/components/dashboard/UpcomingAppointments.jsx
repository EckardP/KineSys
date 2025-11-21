import { Clock, MapPin, User } from "lucide-react"

export default function UpcomingAppointments() {
  const appointments = [
    { id: 1, patient: "Juan García", time: "09:00 AM", room: "Sala 1", type: "Seguimiento" },
    { id: 2, patient: "María López", time: "10:30 AM", room: "Sala 2", type: "Inicial" },
    { id: 3, patient: "Carlos Rodríguez", time: "02:00 PM", room: "Sala 1", type: "Evolución" },
  ]

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-bold mb-4">Próximas Citas</h2>
      <div className="space-y-3">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <User className="text-primary" size={20} />
              </div>
              <div>
                <p className="font-semibold">{appt.patient}</p>
                <p className="text-xs text-muted-foreground">{appt.type}</p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="flex items-center justify-end space-x-1">
                <Clock size={16} />
                <span>{appt.time}</span>
              </p>
              <p className="flex items-center justify-end space-x-1 text-muted-foreground text-xs">
                <MapPin size={14} />
                <span>{appt.room}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
