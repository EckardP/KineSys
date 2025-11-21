import { useState } from 'react'
import { Search } from 'lucide-react'

export default function AuditLog() {
  const [searchTerm, setSearchTerm] = useState('')

  const logs = [
    { id: 1, usuario: 'Dr. López', operacion: 'CREAR', entidad: 'Paciente', detalles: 'Nuevo paciente registrado', fecha: '2024-01-20 14:32', ip: '192.168.1.100' },
    { id: 2, usuario: 'Dra. García', operacion: 'ACTUALIZAR', entidad: 'Historia Clínica', detalles: 'Valoración actualizada', fecha: '2024-01-20 13:15', ip: '192.168.1.105' },
    { id: 3, usuario: 'Recepcionista', operacion: 'VER', entidad: 'Paciente', detalles: 'Consulta de datos personales', fecha: '2024-01-20 12:45', ip: '192.168.1.110' },
    { id: 4, usuario: 'Contador', operacion: 'DESCARGAR', entidad: 'Factura', detalles: 'PDF de factura generado', fecha: '2024-01-20 11:20', ip: '192.168.1.115' },
  ]

  const filteredLogs = logs.filter(log =>
    log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entidad.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 text-text-secondary" size={20} />
        <input
          type="text"
          placeholder="Buscar por usuario o entidad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Usuario</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Operación</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Entidad</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Detalles</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Fecha/Hora</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">IP</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-b border-border hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-text-primary font-medium">{log.usuario}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      log.operacion === 'CREAR'
                        ? 'bg-green-100 text-success'
                        : log.operacion === 'ACTUALIZAR'
                        ? 'bg-blue-100 text-primary'
                        : log.operacion === 'ELIMINAR'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-text-secondary'
                    }`}
                  >
                    {log.operacion}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">{log.entidad}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{log.detalles}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{log.fecha}</td>
                <td className="px-4 py-3 text-sm font-mono text-text-secondary">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
