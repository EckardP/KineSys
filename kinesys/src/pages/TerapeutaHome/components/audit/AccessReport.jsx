export default function AccessReport() {
  const accessData = [
    { usuario: 'Dr. López', rol: 'Terapeuta', accesosHoy: 24, ultimoAcceso: '14:32', estado: 'Activo' },
    { usuario: 'Dra. García', rol: 'Terapeuta', accesosHoy: 18, ultimoAcceso: '13:45', estado: 'Activo' },
    { usuario: 'Recepcionista', rol: 'Recepcionista', accesosHoy: 42, ultimoAcceso: '12:15', estado: 'Activo' },
    { usuario: 'Contador', rol: 'Admin', accesosHoy: 8, ultimoAcceso: '11:20', estado: 'Inactivo' },
  ]

  const totalAccesos = accessData.reduce((acc, user) => acc + user.accesosHoy, 0)

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
        <p className="text-text-secondary text-sm mb-1">Total de Accesos Hoy</p>
        <p className="text-4xl font-bold text-primary">{totalAccesos}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Usuario</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Rol</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-text-primary">Accesos Hoy</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Último Acceso</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Estado</th>
            </tr>
          </thead>
          <tbody>
            {accessData.map((user, index) => (
              <tr key={index} className="border-b border-border hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-text-primary font-medium">{user.usuario}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{user.rol}</td>
                <td className="px-6 py-4 text-sm text-center text-text-primary font-semibold">{user.accesosHoy}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{user.ultimoAcceso}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.estado === 'Activo'
                        ? 'bg-green-100 text-success'
                        : 'bg-gray-100 text-text-secondary'
                    }`}
                  >
                    {user.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
