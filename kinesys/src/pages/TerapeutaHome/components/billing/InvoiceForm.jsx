import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

export default function InvoiceForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    numero: '001-00003',
    paciente: '',
    cedula: '',
    fecha: new Date().toISOString().split('T')[0],
    tipoFactura: 'EPS',
    eps: '',
    servicios: [{ descripcion: '', cantidad: 1, valor: 0 }],
    iva: 19,
    observaciones: '',
  })

  const [items, setItems] = useState([{ descripcion: '', cantidad: 1, valor: 0 }])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = field === 'cantidad' || field === 'valor' ? Number(value) : value
    setItems(newItems)
  }

  const handleAddItem = () => {
    setItems([...items, { descripcion: '', cantidad: 1, valor: 0 }])
  }

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const subtotal = items.reduce((acc, item) => acc + (item.cantidad * item.valor), 0)
  const ivaAmount = (subtotal * formData.iva) / 100
  const total = subtotal + ivaAmount

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.paciente || items.length === 0) {
      alert('Por favor complete los campos obligatorios')
      return
    }
    onSubmit({
      numero: formData.numero,
      paciente: formData.paciente,
      fecha: formData.fecha,
      total: total,
      estado: 'Pendiente',
      eps: formData.eps,
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Nueva Factura - Resolución DIAN 000041/2017</h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información General */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Número Factura</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                disabled
                className="w-full px-3 py-2 border border-border rounded-lg bg-gray-100 text-text-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Fecha *</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Tipo de Factura</label>
              <select
                name="tipoFactura"
                value={formData.tipoFactura}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="EPS">EPS</option>
                <option value="Particular">Particular</option>
                <option value="Crédito">Crédito</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">EPS/Entidad</label>
              <input
                type="text"
                name="eps"
                value={formData.eps}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Datos del Paciente */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Datos del Paciente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* Items de Factura */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Servicios</h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-secondary text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-opacity-90"
            >
              <Plus size={16} />
              <span>Agregar Servicio</span>
            </button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Descripción</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-text-primary w-20">Cantidad</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary w-32">Valor Unitario</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary w-32">Subtotal</th>
                  <th className="px-4 py-3 text-center w-12"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.descripcion}
                        onChange={(e) => handleItemChange(index, 'descripcion', e.target.value)}
                        className="w-full px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Ej: Consulta inicial, 3 sesiones"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                        className="w-full px-2 py-1 border border-border rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.valor}
                        onChange={(e) => handleItemChange(index, 'valor', e.target.value)}
                        className="w-full px-2 py-1 border border-border rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-text-primary">
                      ${(item.cantidad * item.valor).toLocaleString('es-CO')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totales */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2 flex flex-col items-end">
            <div className="flex items-center space-x-4">
              <span className="text-text-secondary">Subtotal:</span>
              <span className="text-lg font-semibold text-text-primary">${subtotal.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-text-secondary">IVA ({formData.iva}%):</span>
              <span className="text-lg font-semibold text-text-primary">${ivaAmount.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex items-center space-x-4 pt-2 border-t border-border">
              <span className="text-text-primary font-bold">Total:</span>
              <span className="text-2xl font-bold text-primary">${total.toLocaleString('es-CO')}</span>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Observaciones</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows="2"
            placeholder="Notas adicionales..."
          />
        </div>

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
            Crear Factura
          </button>
        </div>
      </form>
    </div>
  )
}
