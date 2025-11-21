import { ArrowLeft, Download, Send } from 'lucide-react'

export default function InvoiceDetail({ invoice, onBack }) {
  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-primary hover:text-opacity-80"
      >
        <ArrowLeft size={20} />
        <span>Volver</span>
      </button>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
        {/* Encabezado */}
        <div className="text-center mb-8 border-b border-border pb-8">
          <h1 className="text-3xl font-bold text-text-primary">FACTURA</h1>
          <p className="text-text-secondary"># {invoice.numero}</p>
          <p className="text-sm text-text-secondary mt-2">Sistema de Gestión de Fisioterapia Clínica</p>
        </div>

        {/* Información General */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-text-secondary uppercase mb-2">Facturado A:</h3>
            <p className="text-lg font-semibold text-text-primary">{invoice.paciente}</p>
            <p className="text-sm text-text-secondary">EPS: {invoice.eps}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-secondary">Fecha: {invoice.fecha}</p>
            <p className="text-sm text-text-secondary">Estado: <span className="font-semibold">{invoice.estado}</span></p>
          </div>
        </div>

        {/* Tabla de Servicios */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-t border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Descripción</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-text-primary w-20">Cantidad</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary w-32">Valor Unit.</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary w-32">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 text-text-primary">Servicios de Fisioterapia</td>
              <td className="px-4 py-3 text-center text-text-primary">3</td>
              <td className="px-4 py-3 text-right text-text-primary">${(invoice.total / 3 / 1.19).toLocaleString('es-CO')}</td>
              <td className="px-4 py-3 text-right text-text-primary">${(invoice.total / 1.19).toLocaleString('es-CO')}</td>
            </tr>
          </tbody>
        </table>

        {/* Totales */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="flex justify-between mb-2">
              <span className="text-text-secondary">Subtotal:</span>
              <span className="text-text-primary">${((invoice.total) / 1.19).toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between mb-4 border-b border-border pb-4">
              <span className="text-text-secondary">IVA (19%):</span>
              <span className="text-text-primary">${((invoice.total * 0.19) / 1.19).toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-text-primary">Total:</span>
              <span className="text-primary">${invoice.total.toLocaleString('es-CO')}</span>
            </div>
          </div>
        </div>

        {/* Nota legal */}
        <div className="bg-gray-50 p-4 rounded mb-8 text-xs text-text-secondary">
          <p>Esta factura es un comprobante fiscal. Contiene información de conformidad con la Resolución 000041 de 2017 de la DIAN.</p>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-center space-x-4 pt-8 border-t border-border">
          <button className="flex items-center space-x-2 px-6 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50">
            <Download size={20} />
            <span>Descargar PDF</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">
            <Send size={20} />
            <span>Enviar EPS</span>
          </button>
        </div>
      </div>
    </div>
  )
}
