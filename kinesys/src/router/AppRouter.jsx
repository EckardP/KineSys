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
import Terapeuta from "../pages/GestionAdmin/GestionTerapeuta/Terapeuta"
import AgendaAdmin from "../pages/GestionAdmin/GestionAgenda/AgendaAdmin"
import Reportes from "../pages/GestionAdmin/GestionReporte/Reportes"

import PatientList from "../pages/GestionAdmin/GestionPaciente/PatientList"
import PatientForm from "../pages/GestionAdmin/GestionPaciente/PatientForm"
import PatientDetail from "../pages/GestionAdmin/GestionPaciente/PatientDetail"

import AppointmentList from "../pages/GestionAdmin/GestionCita/AppointmentList"
import AppointmentForm from "../pages/GestionAdmin/GestionCita/AppointmentForm"
import CitaList from "../pages/GestionAdmin/GestionCita/CitaList"

import TerapeutaHome from "../pages/TerapeutaHome/TerapeutaHome"
import TerapeutaForm from "@/pages/GestionAdmin/GestionTerapeuta/TerapeutaForm"
import TerapeutasList from "@/pages/GestionAdmin/GestionTerapeuta/TerapeutasList"
import EquiposList from "@/pages/GestionAdmin/GestionEquipo/EquiposList"
import TipoServiciosList from "@/pages/GestionAdmin/GestionServicio/TipoServiciosList"
import SalasList from "@/pages/GestionAdmin/GestionSala/SalasList"


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

      {/* MÓDULO ADMIN */}
      <Route path="/gestionadmin" element={<AdminHome />} />

      <Route path="/gestionterapeuta/terapeuta" element={<TerapeutasList />} />

      <Route path="/gestionagenda/agendaadmin" element={<AgendaAdmin />} />

      <Route path="/gestionreporte/reportes" element={<Reportes />} />

      <Route path="/gestionpaciente/pacientes" element={<PatientList />} />
      <Route path="/gestionpaciente/nuevo" element={<PatientForm />} />
      <Route path="/gestionpaciente/:id" element={<PatientDetail />} />
      <Route path="/gestionpaciente/editar/:id" element={<PatientForm />} />

      <Route path="/gestioncita/citas" element={<CitaList />} />
      <Route path="/gestioncita/nueva" element={<AppointmentForm />} />
      <Route path="/gestioncita/editar/:id" element={<AppointmentForm />} />

      <Route path="/gestionequipo/equipos" element={<EquiposList />} />

      <Route path="/gestionservicio/servicios" element={<TipoServiciosList />} />

      <Route path="/gestionsala/salas" element={<SalasList />} />

      {/* MÓDULO TERAPEUTA */}
      <Route path="/dashboard" element={<TerapeutaHome />} />
    </Routes>
  )
}
