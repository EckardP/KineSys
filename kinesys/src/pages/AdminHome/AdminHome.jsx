"use client"

// src/pages/AdminHome.jsx
import { useEffect, useState } from "react"
import { Users, CalendarDays, BarChart3, UserPlus, Calendar, Stethoscope } from "lucide-react" // Agregar Stethoscope aquí
import MetricCard from "../GestionAdmin/components/Cartas/MetricCard"
import QuickAccessButton from "../GestionAdmin/components/Botones/QuickAccessButton"
import { listarTerapeutas } from "../../services/terapeutasService.js"
import { listarCitas } from "../../services/citasService.js"
import "./AdminDashboard.css"
import { Routes, Route, Navigate } from "react-router-dom"
import Terapeuta from "../GestionAdmin/GestionTerapeuta/Terapeuta"
import AgendaAdmin from "../GestionAdmin/GestionAgenda/AgendaAdmin"
import AppointmentList from "../GestionAdmin/GestionCita/AppointmentList"
import PatientList from "../GestionAdmin/GestionPaciente/PatientList"
import Reportes from "../GestionAdmin/GestionReporte/Reportes"
import TerapeutaForm from "../GestionAdmin/GestionTerapeuta/TerapeutaForm"
import TratamientosList from "../GestionAdmin/GestionTratamiento/TratamientosList"

function AdminDashboard() {
  const [totalTerapeutas, setTotalTerapeutas] = useState(0)
  const [sesionesDia, setSesionesDia] = useState(0)
  const [ocupacionAgenda, setOcupacionAgenda] = useState(0)

  useEffect(() => {
    async function cargarDatos() {
      try {
        // 🔹 Cargar terapeutas y citas
        const [terapeutas, citas] = await Promise.all([
          listarTerapeutas(),
          listarCitas(), //
        ])

        setTotalTerapeutas(terapeutas.length)

        // 🔹 Calcular sesiones del día
        const hoy = new Date().toDateString()
        const sesionesHoy = citas.filter((cita) => {
          const fechaCita = cita.horaInicioReal ? new Date(cita.horaInicioReal).toDateString() : null
          return fechaCita === hoy && cita.estado === "confirmada"
        }).length
        setSesionesDia(sesionesHoy)

        // 🔹 Calcular ocupación de agenda (Opción simple)
        const slotsDisponiblesTotales = terapeutas.length * 8
        const ocupacion = slotsDisponiblesTotales > 0 ? Math.round((sesionesHoy / slotsDisponiblesTotales) * 100) : 0
        setOcupacionAgenda(ocupacion)
      } catch (error) {
        console.error("Error al cargar datos del Dashboard:", error)
      }
    }

    cargarDatos()
  }, [])

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-title">Panel del Administrador</h1>

        {/* Métricas globales */}
        <div className="metrics-section">
          <MetricCard title="Terapeutas Activos" value={totalTerapeutas} icon={<Users size={24} />} />
          <MetricCard title="Sesiones del Día" value={sesionesDia} icon={<CalendarDays size={24} />} />
          <MetricCard title="Ocupación de Agenda" value={`${ocupacionAgenda}%`} icon={<BarChart3 size={24} />} />
        </div>

        {/* Accesos rápidos */}
        <div className="quick-access-section">
          <h2 className="section-title">Accesos Rápidos</h2>
          <div className="quick-access-buttons">
            <QuickAccessButton
              label="Gestionar Pacientes"
              path="/gestionpaciente/pacientes"
              icon={<UserPlus size={20} />}
            />
            <QuickAccessButton label="Gestionar Citas" path="/gestioncita/citas" icon={<Calendar size={20} />} />
            <QuickAccessButton
              label="Gestionar Terapeutas"
              path="/gestionterapeuta/terapeuta"
              icon={<Users size={20} />}
            />
            <QuickAccessButton label="Ver Agenda" path="/gestionagenda/agendaadmin" icon={<CalendarDays size={20} />} />
            <QuickAccessButton label="Ver Reportes" path="/gestionreporte/reportes" icon={<BarChart3 size={20} />} />
            <QuickAccessButton 
              label="Gestionar Tratamientos" 
              path="/gestiontratamiento/tratamientos" 
              icon={<Stethoscope size={20} />} // Ahora Stethoscope está definido
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminHome() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/gestionterapeuta/terapeuta" element={<TerapeutaForm />} />
      <Route path="/gestionagenda/agendaadmin" element={<AgendaAdmin />} />
      <Route path="/gestioncita/citas" element={<AppointmentList />} />
      <Route path="/gestionpaciente/pacientes" element={<PatientList />} />
      <Route path="/gestionreporte/reportes" element={<Reportes />} />
      <Route path="/gestiontratamiento/tratamientos" element={<TratamientosList />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}