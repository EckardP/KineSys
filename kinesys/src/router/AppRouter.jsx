import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Therapists from "../pages/Therapists"
import Pacientes from "../pages/Gestionpaciente/Pacientes"
import FormPaciente from "../pages/Gestionpaciente/FormPaciente"
import Treatments from "../pages/Treatments"
import Agenda from "../pages/Agenda"
import Login from "../pages/Login"
import PacienteCardMini from "../pages/Gestionpaciente/components/PacienteCardMini"

import AdminHome from "../pages/AdminHome/AdminHome"
import AgendaAdmin from "../pages/GestionAdmin/GestionAgenda/AgendaAdmin"
import Reportes from "../pages/GestionAdmin/GestionReporte/Reportes"

import PatientList from "../pages/GestionAdmin/GestionPaciente/PatientList"
import PatientForm from "../pages/GestionAdmin/GestionPaciente/PatientForm"
import PatientDetail from "../pages/GestionAdmin/GestionPaciente/PatientDetail"

import AppointmentList from "../pages/GestionAdmin/GestionCita/AppointmentList"
import AppointmentForm from "../pages/GestionAdmin/GestionCita/AppointmentForm"

import TerapeutaHome from "../pages/TerapeutaHome/TerapeutaHome"
import TerapeutasList from "@/pages/GestionAdmin/GestionTerapeuta/TerapeutasList"
import PacienteDashboard from "../pages/Gestionpaciente/PacienteDashboard"
import EquiposList from "@/pages/GestionAdmin/GestionEquipo/EquiposList"

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/therapists" element={<Therapists />} />
      <Route path="/treatments" element={<Treatments />} />
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/login" element={<Login />} />

      {/* MÓDULO PACIENTES LEGACY (puede ser deprecado eventualmente) */}
      <Route path="/pacientes" element={<Pacientes />} />
      <Route path="/pacientes/nuevo" element={<FormPaciente />} />
      <Route path="/pacientes/:id" element={<PacienteCardMini />} />

      {/* MÓDULO ADMIN - Added /* to allow nested routes */}
      <Route path="/gestionadmin/*" element={<AdminHome />} />

      <Route path="/gestionterapeuta/terapeuta" element={<TerapeutasList />} />

      <Route path="/gestionagenda/agendaadmin" element={<AgendaAdmin />} />

      <Route path="/gestionreporte/reportes" element={<Reportes />} />

      <Route path="/gestionpaciente/pacientes" element={<PatientList />} />
      <Route path="/gestionpaciente/nuevo" element={<PatientForm />} />
      <Route path="/gestionpaciente/:id" element={<PatientDetail />} />
      <Route path="/gestionpaciente/editar/:id" element={<PatientForm />} />

      <Route path="/gestioncita/citas" element={<AppointmentList />} />
      <Route path="/gestioncita/nueva" element={<AppointmentForm />} />
      <Route path="/gestioncita/editar/:id" element={<AppointmentForm />} />

      <Route path="/gestionequipo/equipos" element={<EquiposList />} />

      {/* MÓDULO TERAPEUTA */}
      <Route path="/dashboard" element={<TerapeutaHome />} />

      <Route path="/paciente-dashboard" element={<PacienteDashboard />} />
    </Routes>
  )
}
