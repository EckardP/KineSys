import { ArrowLeft, FileText } from 'lucide-react'

export default function HistoryDetail({ history, onBack }) {
  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-primary hover:text-opacity-80"
      >
        <ArrowLeft size={20} />
        <span>Volver</span>
      </button>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-primary bg-opacity-10 p-3 rounded-full">
            <FileText className="text-primary" size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{history.paciente}</h1>
            <p className="text-text-secondary">Cédula: {history.cedula}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <p className="text-text-secondary text-sm mb-1">Fecha de Valoración</p>
            <p className="text-lg font-semibold text-text-primary">{history.fecha}</p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <p className="text-text-secondary text-sm mb-1">Diagnóstico</p>
            <p className="text-lg font-semibold text-text-primary">{history.diagnostico}</p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <p className="text-text-secondary text-sm mb-1">Estado</p>
            <span className="px-3 py-1 bg-green-100 text-success rounded-full text-xs font-medium">
              {history.estado}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <p className="text-text-secondary text-sm mb-2">Sesiones Realizadas</p>
          <p className="text-3xl font-bold text-primary">5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <p className="text-text-secondary text-sm mb-2">Próxima Cita</p>
          <p className="text-lg font-semibold text-text-primary">2024-01-25</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <p className="text-text-secondary text-sm mb-2">Progreso Clínico</p>
          <p className="text-lg font-semibold text-success">85% Mejoría</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
        <h3 className="text-lg font-bold text-text-primary mb-4">Evolución de Sesiones</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-border rounded">
              <div>
                <p className="font-semibold text-text-primary">Sesión {i}</p>
                <p className="text-sm text-text-secondary">Evaluación de progreso</p>
              </div>
              <span className="text-sm text-success">✓ Completada</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
