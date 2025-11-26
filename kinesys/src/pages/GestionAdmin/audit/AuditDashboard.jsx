import { useState } from 'react'
import { Shield, AlertCircle, CheckCircle, Clock, BarChart3, LogOut } from 'lucide-react'
import AuditLog from './AuditLog'
import ComplianceChecklist from './ComplianceChecklist'
import AccessReport from './AccessReport'

export default function AuditDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const auditStats = [
    { label: 'Total de Registros', value: '1,247', icon: BarChart3, color: 'bg-primary' },
    { label: 'Accesos Hoy', value: '89', icon: LogOut, color: 'bg-secondary' },
    { label: 'Alertas', value: '3', icon: AlertCircle, color: 'bg-warning' },
    { label: 'Verificaciones OK', value: '98%', icon: CheckCircle, color: 'bg-success' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Auditoría y Cumplimiento Normativo</h1>
        <p className="text-text-secondary mt-1">Ley 1581/2012 - Protección de Datos Personales</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {auditStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-text-primary mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-border">
        <div className="flex space-x-2 border-b border-border p-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'logs'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Registro de Auditoría
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'compliance'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Cumplimiento
          </button>
          <button
            onClick={() => setActiveTab('access')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'access'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Reporte de Acceso
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-4">Normativa Aplicable</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 border border-border rounded">
                      <CheckCircle className="text-success flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-text-primary">Ley 1581 de 2012</p>
                        <p className="text-sm text-text-secondary">Protección de datos personales</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border border-border rounded">
                      <CheckCircle className="text-success flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-text-primary">Resolución 1995/1999</p>
                        <p className="text-sm text-text-secondary">Normas para la práctica de la medicina</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border border-border rounded">
                      <CheckCircle className="text-success flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-text-primary">Resolución 000041/2017</p>
                        <p className="text-sm text-text-secondary">Facturación electrónica DIAN</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-4">Alertas de Seguridad</h3>
                  <div className="space-y-2">
                    {[
                      { severity: 'warning', message: 'Acceso no autorizado detectado', time: 'Hace 2 horas' },
                      { severity: 'info', message: 'Respaldo de datos completado', time: 'Hace 4 horas' },
                      { severity: 'success', message: 'Certificado SSL válido', time: 'Válido hasta 2025' },
                    ].map((alert, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded border ${
                          alert.severity === 'warning'
                            ? 'border-warning bg-orange-50'
                            : alert.severity === 'info'
                            ? 'border-primary bg-blue-50'
                            : 'border-success bg-green-50'
                        }`}
                      >
                        <p className="text-sm font-medium text-text-primary">{alert.message}</p>
                        <p className="text-xs text-text-secondary mt-1">{alert.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && <AuditLog />}
          {activeTab === 'compliance' && <ComplianceChecklist />}
          {activeTab === 'access' && <AccessReport />}
        </div>
      </div>
    </div>
  )
}
