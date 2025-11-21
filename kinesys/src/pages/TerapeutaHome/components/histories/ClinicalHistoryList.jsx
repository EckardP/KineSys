import { useState } from 'react'
import { Plus, Eye, Edit, Trash2, FileText } from 'lucide-react'
import VaIoracionForm from './VaIoracionForm'
import HistoryDetail from './HistoryDetail'

export default function ClinicalHistoryList() {
  const [histories, setHistories] = useState([
    { id: 1, paciente: 'Juan García', cedula: '1234567890', fecha: '2024-01-15', diagnostico: 'Lumbalgia', estado: 'Activo' },
    { id: 2, paciente: 'María López', cedula: '9876543210', fecha: '2024-01-10', diagnostico: 'Cervicalgia', estado: 'Activo' },
  ])
  const [showForm, setShowForm] = useState(false)
  const [selectedHistory, setSelectedHistory] = useState(null)

  const handleAddHistory = (newHistory) => {
    setHistories([...histories, { ...newHistory, id: Date.now(), estado: 'Activo' }])
    setShowForm(false)
  }

  const handleDeleteHistory = (id) => {
    if (confirm('¿Está seguro que desea eliminar esta historia?')) {
      setHistories(histories.filter(h => h.id !== id))
    }
  }

  if (selectedHistory) {
    return <HistoryDetail history={selectedHistory} onBack={() => setSelectedHistory(null)} />
  }

  if (showForm) {
    return <VaIoracionForm onSubmit={handleAddHistory} onCancel={() => setShowForm(false)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Historias Clínicas</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-90"
        >
          <Plus size={20} />
          <span>Nueva Valoración</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-primary bg-opacity-10 p-3 rounded-full">
            <FileText className="text-primary" size={24} />
          </div>
          <div>
            <p className="text-text-secondary text-sm">Total de Historias</p>
            <p className="text-3xl font-bold text-text-primary">{histories.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Paciente</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Cédula</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Diagnóstico</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {histories.map((history) => (
              <tr key={history.id} className="border-b border-border hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-text-primary font-medium">{history.paciente}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{history.cedula}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{history.fecha}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{history.diagnostico}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-green-100 text-success rounded-full text-xs font-medium">
                    {history.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2 flex items-center">
                  <button
                    onClick={() => setSelectedHistory(history)}
                    className="p-2 hover:bg-blue-50 text-primary rounded transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteHistory(history.id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
