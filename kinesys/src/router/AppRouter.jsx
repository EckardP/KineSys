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
    </Routes>
  )
}
