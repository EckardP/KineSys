import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Therapists from '../pages/Therapists'
import Pacientes from '../pages/Gestionpaciente/Pacientes'
import FormPaciente from '../pages/Gestionpaciente/FormPaciente'
import FichaPaciente from '../pages/Gestionpaciente/FichaPaciente'
import Treatments from '../pages/Treatments'
import Agenda from '../pages/Agenda'
import Login from '../pages/Login'
import PacienteCardMini from '../pages/Gestionpaciente/components/PacienteCardMini'
import AdminHome from "../pages/AdminHome/AdminHome";
import Terapeuta from "../pages/GestionAdmin/GestionTerapeuta/Terapeuta";
import AgendaAdmin from "../pages/GestionAdmin/GestionAgenda/AgendaAdmin";
import Reportes from '../pages/GestionAdmin/GestionReporte/Reportes'
import Citas from '../pages/GestionAdmin/GestionCita/Citas'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/therapists" element={<Therapists />} />
      <Route path="/treatments" element={<Treatments />} />
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/login" element={<Login/>}/>

      {/* MÓDULO PACIENTES */}
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/pacientes/nuevo" element={<FormPaciente />} />
        <Route path="/pacientes/:id" element={<PacienteCardMini />} />

        {/* MÓDULO ADMIN*/}
         <Route path="/gestionadmin" element={<AdminHome />} />
         <Route path="/gestionterapeuta/terapeuta" element={<Terapeuta />} />
          <Route path="/gestionagenda/agendaadmin" element={<AgendaAdmin />} />
          <Route path="/gestionreporte/reportes" element={<Reportes />} />
          <Route path="/gestioncita/citas" element={<Citas />} />
    </Routes>
  )
}
