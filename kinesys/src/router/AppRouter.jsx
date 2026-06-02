import { Route, Routes } from "react-router-dom"
import Home from "@/features/public/Home"
import Therapists from "@/features/public/Therapists"
import Treatments from "@/features/public/Treatments"
import Agenda from "@/features/public/Agenda"
import Login from "@/features/auth/Login"
import Pacientes from "@/features/patient/Gestionpaciente/Pacientes"
import FormPaciente from "@/features/patient/Gestionpaciente/FormPaciente"
import PacienteCardMini from "@/features/patient/Gestionpaciente/components/PacienteCardMini"
import PacienteDashboard from "@/features/patient/Gestionpaciente/PacienteDashboard"
import AdminHome from "@/features/admin/AdminHome/AdminHome"
import AgendaAdmin from "@/features/admin/GestionAdmin/GestionAgenda/AgendaAdmin"
import Reportes from "@/features/admin/GestionAdmin/GestionReporte/Reportes"
import PatientList from "@/features/admin/GestionAdmin/GestionPaciente/PatientList"
import PatientForm from "@/features/admin/GestionAdmin/GestionPaciente/PatientForm"
import PatientDetail from "@/features/admin/GestionAdmin/GestionPaciente/PatientDetail"
import AppointmentForm from "@/features/admin/GestionAdmin/GestionCita/AppointmentForm"
import CitaList from "@/features/admin/GestionAdmin/GestionCita/CitaList"
import TerapeutasList from "@/features/admin/GestionAdmin/GestionTerapeuta/TerapeutasList"
import TratamientosList from "@/features/admin/GestionAdmin/GestionTratamiento/TratamientosList"
import EquiposList from "@/features/admin/GestionAdmin/GestionEquipo/EquiposList"
import TipoServiciosList from "@/features/admin/GestionAdmin/GestionServicio/TipoServiciosList"
import SalasList from "@/features/admin/GestionAdmin/GestionSala/SalasList"
import TerapeutaHome from "@/features/therapist/TerapeutaHome/TerapeutaHome"

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/therapists" element={<Therapists />} />
      <Route path="/treatments" element={<Treatments />} />
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/login" element={<Login />} />

      {/* Modulo pacientes legacy */}
      <Route path="/pacientes" element={<Pacientes />} />
      <Route path="/pacientes/nuevo" element={<FormPaciente />} />
      <Route path="/pacientes/:id" element={<PacienteCardMini />} />

      {/* Modulo administrador */}
      <Route path="/gestionadmin/*" element={<AdminHome />} />
      <Route path="/AdminHome/*" element={<AdminHome />} />
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
      <Route path="/gestiontratamiento/tratamientos" element={<TratamientosList />} />
      <Route path="/gestionequipo/equipos" element={<EquiposList />} />
      <Route path="/gestionservicio/servicios" element={<TipoServiciosList />} />
      <Route path="/gestionsala/salas" element={<SalasList />} />

      {/* Modulo terapeuta y paciente */}
      <Route path="/dashboard" element={<TerapeutaHome />} />
      <Route path="/paciente-dashboard" element={<PacienteDashboard />} />
    </Routes>
  )
}
