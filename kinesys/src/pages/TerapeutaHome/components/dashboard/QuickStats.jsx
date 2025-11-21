"use client"

import { useState, useEffect } from "react"
import { Users, Calendar, FileText, CreditCard } from "lucide-react"
import { listarPacientes } from "../../../../services/pacientesService"
import { listarCitas } from "../../../../services/citasService"

export default function QuickStats() {
  const [stats, setStats] = useState({
    pacientes: 0,
    citasHoy: 0,
    historias: 0,
    facturasPendientes: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Obtener pacientes
        const pacientesData = await listarPacientes()
        const totalPacientes = pacientesData?.length || 0

        // Obtener citas y filtrar las de hoy
        const citasData = await listarCitas()
        const hoy = new Date().toISOString().split('T')[0]
        
        const citasHoy = citasData?.filter(cita => {
          const fechaCita = cita.fecha ? cita.fecha.split('T')[0] : null
          return fechaCita === hoy
        }).length || 0

        setStats({
          pacientes: totalPacientes,
          citasHoy: citasHoy,
          historias: 142,
          facturasPendientes: 5
        })

      } catch (err) {
        console.error('Error cargando estadísticas:', err)
        setError('Error al cargar las estadísticas')
        setStats({
          pacientes: 0,
          citasHoy: 0,
          historias: 0,
          facturasPendientes: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statItems = [
    { icon: Users, label: "Pacientes", value: stats.pacientes, color: "bg-blue-500" },
    { icon: Calendar, label: "Citas Hoy", value: stats.citasHoy, color: "bg-green-500" },
    { icon: FileText, label: "Historias", value: stats.historias, color: "bg-purple-500" },
    { icon: CreditCard, label: "Facturas Pendientes", value: stats.facturasPendientes, color: "bg-orange-500" },
  ]

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                {/* CORREGIDO: Cambiamos el p por div para evitar el error de nesting */}
                <div className="text-3xl font-bold mt-2 text-gray-900">
                  {loading && index < 2 ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stat.value
                  )}
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <Icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}