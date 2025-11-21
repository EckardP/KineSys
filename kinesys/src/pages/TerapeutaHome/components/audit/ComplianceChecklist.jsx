import { Check, X } from 'lucide-react'

export default function ComplianceChecklist() {
  const items = [
    { category: 'Protección de Datos', items: [
      { task: 'Consentimiento informado firmado', status: true },
      { task: 'Política de privacidad visible', status: true },
      { task: 'Derechos del titular notificados', status: true },
      { task: 'Responsable de datos designado', status: true },
    ]},
    { category: 'Seguridad Física y Digital', items: [
      { task: 'Acceso a datos restringido por rol', status: true },
      { task: 'Encriptación de datos sensibles', status: true },
      { task: 'Respaldos automáticos habilitados', status: true },
      { task: 'Auditoría de acceso registrada', status: true },
    ]},
    { category: 'Cumplimiento Clínico', items: [
      { task: 'Historias clínicas con CIE-10', status: true },
      { task: 'Valoraciones iniciales documentadas', status: true },
      { task: 'Firma digital de profesionales', status: false },
      { task: 'Reportes a EPS generados', status: true },
    ]},
    { category: 'Facturación', items: [
      { task: 'CUFE generado por factura', status: true },
      { task: 'IVA calculado correctamente', status: true },
      { task: 'Numeración secuencial verificada', status: true },
    ]},
  ]

  const totalItems = items.reduce((acc, cat) => acc + cat.items.length, 0)
  const completedItems = items.reduce((acc, cat) => acc + cat.items.filter(i => i.status).length, 0)
  const compliance = ((completedItems / totalItems) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg text-white">
        <p className="text-sm opacity-90">Cumplimiento Normativo General</p>
        <p className="text-4xl font-bold mt-2">{compliance}%</p>
        <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
          <div className="bg-white rounded-full h-2" style={{width: `${compliance}%`}}></div>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((category, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-border">
              <h3 className="font-bold text-text-primary">{category.category}</h3>
            </div>
            <div className="divide-y divide-border">
              {category.items.map((item, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <span className="text-text-primary">{item.task}</span>
                  {item.status ? (
                    <Check className="text-success" size={24} />
                  ) : (
                    <X className="text-red-600" size={24} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
