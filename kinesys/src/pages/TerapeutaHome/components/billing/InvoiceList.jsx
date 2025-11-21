import { useState } from 'react'
import { Plus, Eye, Download, Trash2, CreditCard } from 'lucide-react'
import InvoiceForm from './InvoiceForm'
import InvoiceDetail from './InvoiceDetail'

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([
    { id: 1, numero: '001-00001', paciente: 'Juan García', fecha: '2024-01-15', total: 150000, estado: 'Pagada', eps: 'Sura' },
    { id: 2, numero: '001-00002', paciente: 'María López', fecha: '2024-01-16', total: 180000, estado: 'Pendiente', eps: 'EPS Cafeteros' },
  ])
  const [showForm, setShowForm] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const handleAddInvoice = (newInvoice) => {
    setInvoices([...invoices, { ...newInvoice, id: Date.now() }])
    setShowForm(false)
  }

  const handleDeleteInvoice = (id) => {
    if (confirm('¿Está seguro que desea eliminar esta factura?')) {
      setInvoices(invoices.filter(i => i.id !== id))
    }
  }

  if (selectedInvoice) {
    return <InvoiceDetail invoice={selectedInvoice} onBack={() => setSelectedInvoice(null)} />
  }

  if (showForm) {
    return <InvoiceForm onSubmit={handleAddInvoice} onCancel={() => setShowForm(false)} />
  }

  const totalPagadas = invoices.filter(i => i.estado === 'Pagada').length
  const totalPendiente = invoices.filter(i => i.estado === 'Pendiente').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Gestión de Facturación</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-90"
        >
          <Plus size={20} />
          <span>Nueva Factura</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Facturas</p>
              <p className="text-3xl font-bold text-primary mt-2">{invoices.length}</p>
            </div>
            <CreditCard className="text-primary opacity-20" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <div>
            <p className="text-text-secondary text-sm">Facturas Pagadas</p>
            <p className="text-3xl font-bold text-success mt-2">{totalPagadas}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <div>
            <p className="text-text-secondary text-sm">Facturas Pendientes</p>
            <p className="text-3xl font-bold text-warning mt-2">{totalPendiente}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Número</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Paciente</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">EPS/Particular</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Total</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-border hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-text-primary font-mono font-medium">{invoice.numero}</td>
                <td className="px-6 py-4 text-sm text-text-primary">{invoice.paciente}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{invoice.fecha}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{invoice.eps}</td>
                <td className="px-6 py-4 text-sm text-text-primary font-semibold">
                  ${invoice.total.toLocaleString('es-CO')}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      invoice.estado === 'Pagada'
                        ? 'bg-green-100 text-success'
                        : 'bg-orange-100 text-warning'
                    }`}
                  >
                    {invoice.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2 flex items-center">
                  <button
                    onClick={() => setSelectedInvoice(invoice)}
                    className="p-2 hover:bg-blue-50 text-primary rounded transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    className="p-2 hover:bg-green-50 text-success rounded transition-colors"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteInvoice(invoice.id)}
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
