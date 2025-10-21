import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Therapists from '../pages/Therapists'
import Patients from '../pages/Patients'
import Treatments from '../pages/Treatments'
import Agenda from '../pages/Agenda'
import InicioSesion from '../pages/InicioSesion'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/therapists" element={<Therapists />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/treatments" element={<Treatments />} />
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/iniciosesion" element={<InicioSesion/>}/>
    </Routes>
  )
}
