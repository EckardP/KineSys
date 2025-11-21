import { useState } from 'react'
import { X } from 'lucide-react'

export default function VaIoracionForm({ onSubmit, onCancel }) {
  const [tab, setTab] = useState('anamnesis')
  const [formData, setFormData] = useState({
    paciente: '',
    cedula: '',
    fecha: new Date().toISOString().split('T')[0],
    terapeuta: '',
    // Anamnesis
    motivoConsulta: '',
    historiaEnfermedad: '',
    antecedentes: '',
    medicamentos: '',
    // Examen Físico
    presionArterial: '',
    frecuenciaCardiaca: '',
    temperatura: '',
    imc: '',
    // Examen Musculoesquelético
    rangoMovimiento: '',
    fuerzaMuscular: '',
    balance: '',
    testEspeciales: '',
    // Diagnóstico
    diagnostico: '',
    codigoCIE10: '',
    // Plan
    planTratamiento: '',
    sesionesPlaneadas: '',
    frecuencia: '',
    duracionSesion: '',
    objetivos: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.paciente || !formData.diagnostico) {
      alert('Por favor complete los campos obligatorios')
      return
    }
    onSubmit({
      paciente: formData.paciente,
      cedula: formData.cedula,
      fecha: formData.fecha,
      diagnostico: formData.diagnostico,
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Valoración Inicial - Resolución 1995/1999</h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-2 border-b border-border">
          {['anamnesis', 'examenFisico', 'diagnostico', 'plan'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              type="button"
              className={`px-4 py-2 font-medium transition-colors ${
                tab === t
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {t === 'anamnesis' && 'Anamnesis'}
              {t === 'examenFisico' && 'Examen Físico'}
              {t === 'diagnostico' && 'Diagnóstico'}
              {t === 'plan' && 'Plan'}
            </button>
          ))}
        </div>

        {/* Información General */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Paciente *</label>
            <input
              type="text"
              name="paciente"
              value={formData.paciente}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Cédula</label>
            <input
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Terapeuta</label>
            <select
              name="terapeuta"
              value={formData.terapeuta}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Seleccionar</option>
              <option value="Dr. López">Dr. López</option>
              <option value="Dra. García">Dra. García</option>
            </select>
          </div>
        </div>

        {/* Anamnesis */}
        {tab === 'anamnesis' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Motivo de Consulta</label>
              <textarea
                name="motivoConsulta"
                value={formData.motivoConsulta}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Historia de la Enfermedad Actual</label>
              <textarea
                name="historiaEnfermedad"
                value={formData.historiaEnfermedad}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Antecedentes Personales</label>
              <textarea
                name="antecedentes"
                value={formData.antecedentes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Medicamentos Actuales</label>
              <textarea
                name="medicamentos"
                value={formData.medicamentos}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
              />
            </div>
          </div>
        )}

        {/* Examen Físico */}
        {tab === 'examenFisico' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Presión Arterial (mmHg)</label>
                <input
                  type="text"
                  name="presionArterial"
                  value={formData.presionArterial}
                  onChange={handleChange}
                  placeholder="120/80"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Frecuencia Cardíaca (bpm)</label>
                <input
                  type="number"
                  name="frecuenciaCardiaca"
                  value={formData.frecuenciaCardiaca}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Temperatura (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  name="temperatura"
                  value={formData.temperatura}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">IMC</label>
                <input
                  type="number"
                  step="0.1"
                  name="imc"
                  value={formData.imc}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Rango de Movimiento (ROM)</label>
              <textarea
                name="rangoMovimiento"
                value={formData.rangoMovimiento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Fuerza Muscular (Escala 0-5)</label>
              <textarea
                name="fuerzaMuscular"
                value={formData.fuerzaMuscular}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows="2"
              />
            </div>
          </div>
        )}

        {/* Diagnóstico */}
        {tab === 'diagnostico' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Diagnóstico Fisioterapéutico *</label>
              <textarea
                name="diagnostico"
                value={formData.diagnostico}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Código CIE-10</label>
              <input
                type="text"
                name="codigoCIE10"
                value={formData.codigoCIE10}
                onChange={handleChange}
                placeholder="M54.5"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Plan de Tratamiento */}
        {tab === 'plan' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Plan de Tratamiento</label>
              <textarea
                name="planTratamiento"
                value={formData.planTratamiento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Sesiones Planeadas</label>
                <input
                  type="number"
                  name="sesionesPlaneadas"
                  value={formData.sesionesPlaneadas}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Frecuencia Semanal</label>
                <input
                  type="text"
                  name="frecuencia"
                  value={formData.frecuencia}
                  onChange={handleChange}
                  placeholder="3 veces/semana"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Duración Sesión (min)</label>
                <input
                  type="number"
                  name="duracionSesion"
                  value={formData.duracionSesion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Objetivos del Tratamiento</label>
              <textarea
                name="objetivos"
                value={formData.objetivos}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-border rounded-lg text-text-primary hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
          >
            Guardar Valoración
          </button>
        </div>
      </form>
    </div>
  )
}
