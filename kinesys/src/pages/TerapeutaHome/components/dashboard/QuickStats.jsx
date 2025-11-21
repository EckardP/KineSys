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

  // Función para normalizar fechas (maneja diferentes formatos)
  const normalizarFecha = (fecha) => {
    if (!fecha) return null
    
    try {
      // Si ya está en formato YYYY-MM-DD
      if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return fecha
      }
      
      // Si es una fecha completa con tiempo
      const dateObj = new Date(fecha)
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toISOString().split('T')[0]
      }
      
      return null
    } catch {
      return null
    }
  }

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
          const fechaCita = normalizarFecha(cita.fecha)
          return fechaCita === hoy
        }).length || 0

        setStats({
          pacientes: totalPacientes,
          citasHoy: citasHoy,
          historias: 142, // Estático por ahora
          facturasPendientes: 5 // Estático por ahora
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold mt-2 text-gray-900">
                  {loading && index < 2 ? ( // Solo los primeros 2 cargan de la API
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stat.value
                  )}
                </p>
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