
import { ArrowLeft, Package, MapPin, BarChart3, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EquipoDetail({ equipo, onBack }) {
  console.log("📋 EquipoDetail: Datos del equipo:", equipo)

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="ghost" className="flex items-center space-x-2">
        <ArrowLeft size={20} />
        <span>Volver</span>
      </Button>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{equipo.nombreEquipo}</h1>
            <p className="text-gray-600 mt-1">ID: {equipo.idEquipo}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información Básica */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Información Básica</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Package className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium">{equipo.nombreEquipo}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Descripción</p>
                <p className="font-medium">{equipo.descripcion || "Sin descripción"}</p>
              </div>
              <div className="flex items-center space-x-3">
                <BarChart3 className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Cantidad</p>
                  <p className="font-medium">{equipo.cantidad}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Estado y Ubicación */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Estado y Ubicación</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <p className="font-medium">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    equipo.estado === 'Disponible' ? 'bg-green-100 text-green-800' :
                    equipo.estado === 'En Mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {equipo.estado}
                  </span>
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="font-medium">{equipo.ubicacion || "No especificada"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Información Adicional</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">ID del Equipo</p>
              <p className="font-medium">{equipo.idEquipo}</p>
            </div>
            {/* Aquí puedes agregar más campos si es necesario */}
          </div>
        </div>
      </div>

      {/* Estadísticas (puedes personalizar según necesites) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <Calendar className="text-blue-600" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sesiones Realizadas</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <BarChart3 className="text-green-600" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Disponibilidad</h3>
              <p className="text-3xl font-bold text-green-600">
                {equipo.estado === 'Disponible' ? '100%' : '0%'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <Package className="text-purple-600" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">En Uso Actual</h3>
              <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
