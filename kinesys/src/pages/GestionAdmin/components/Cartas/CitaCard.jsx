// src/components/Cards/CitaCard.jsx

import { Calendar, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function CitaCard() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/gestioncita/citas")
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Gestión de Citas</h3>
          <p className="text-gray-600 text-sm">Agenda y administra citas entre pacientes y terapeutas</p>
        </div>
        <button
          onClick={handleClick}
          className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  )
}
