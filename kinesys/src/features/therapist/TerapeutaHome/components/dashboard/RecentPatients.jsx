import { Plus } from "lucide-react"

export default function RecentPatients() {
  const patients = [
    { id: 1, name: "Juan García", date: "Hoy" },
    { id: 2, name: "María López", date: "Ayer" },
    { id: 3, name: "Carlos Rodríguez", date: "2 días" },
  ]

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Pacientes Recientes</h2>
        <button className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90">
          <Plus size={20} />
        </button>
      </div>
      <div className="space-y-2">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="flex items-center justify-between p-2 border rounded hover:bg-muted/50 transition-colors"
          >
            <span className="font-medium">{patient.name}</span>
            <span className="text-xs text-muted-foreground">{patient.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
