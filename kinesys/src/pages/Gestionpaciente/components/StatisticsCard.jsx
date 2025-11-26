"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../../context/AuthContext"
import { citasApi } from "../../../api/citasApi"
import { evolucionesPacienteApi } from "../../../api/evolucionesPaciente"

export default function StatisticsCard() {
  const { usuario } = useContext(AuthContext)
  const [stats, setStats] = useState({
    citasProximas: 0,
    citasCompletadas: 0,
    evolucionesPendientes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Obtener todas las citas
        const citas = await citasApi.getAll()
        const citasDelPaciente = citas.filter((cita) => cita.pacienteId === usuario?.id)

        // Separar citas próximas y completadas
        const ahora = new Date()
        const proximas = citasDelPaciente.filter((cita) => new Date(cita.fecha) >= ahora).length
        const completadas = citasDelPaciente.filter((cita) => new Date(cita.fecha) < ahora).length

        // Obtener evoluciones
        const evoluciones = await evolucionesPacienteApi.getAll()
        const evolucionesPaciente = evoluciones.filter((e) => e.pacienteId === usuario?.id)
        const pendientes = evolucionesPaciente.filter((e) => !e.completada).length

        setStats({
          citasProximas: proximas,
          citasCompletadas: completadas,
          evolucionesPendientes: pendientes,
        })
      } catch (error) {
        console.error("Error al cargar estadísticas:", error)
      } finally {
        setLoading(false)
      }
    }

    if (usuario?.id) {
      fetchStats()
    }
  }, [usuario?.id])

  const statItems = [
    {
      label: "Citas Próximas",
      value: stats.citasProximas,
      icon: "📅",
      color: "stat-blue",
    },
    {
      label: "Citas Completadas",
      value: stats.citasCompletadas,
      icon: "✓",
      color: "stat-green",
    },
    {
      label: "Evoluciones Pendientes",
      value: stats.evolucionesPendientes,
      icon: "📋",
      color: "stat-orange",
    },
  ]

  return (
    <div className="statistics-grid">
      {statItems.map((item, index) => (
        <div key={index} className={`stat-card ${item.color}`}>
          <div className="stat-icon">{item.icon}</div>
          <div className="stat-content">
            <p className="stat-label">{item.label}</p>
            <p className="stat-value">{loading ? "-" : item.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
