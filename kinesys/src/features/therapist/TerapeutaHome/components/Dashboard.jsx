import { useContext } from "react"
import QuickStats from "./dashboard/QuickStats"
import UpcomingAppointments from "./dashboard/UpcomingAppointments"
import RecentPatients from "./dashboard/RecentPatients"
import { AuthContext } from "@/context/AuthContext"



export default function Dashboard() {
  const { usuario } = useContext(AuthContext)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground"> Bienvenido al Sistema de Gestión de Fisioterapia{usuario?.nombreCompleto && `, Dr. ${usuario.nombreCompleto}`}</p>
      </div>

      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingAppointments />
        </div>
        <div>
          <RecentPatients />
        </div>
      </div>
    </div>
  )
}
