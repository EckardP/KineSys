
import { Label } from "@/components/ui/label"

export default function TipoServicioConfigInfo({ formData, onChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Configuración del Servicio</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Compatibilidad</h4>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="compatibleConEPS"
              name="compatibleConEPS"
              checked={formData.compatibleConEPS}
              onChange={onChange}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-400"
            />
            <Label htmlFor="compatibleConEPS" className="text-gray-700 cursor-pointer">
              Compatible con EPS
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="compatibleConPrepagadas"
              name="compatibleConPrepagadas"
              checked={formData.compatibleConPrepagadas}
              onChange={onChange}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-400"
            />
            <Label htmlFor="compatibleConPrepagadas" className="text-gray-700 cursor-pointer">
              Compatible con Prepagadas
            </Label>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-700 mb-2">Resumen del Servicio</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div><strong>Duración:</strong> {formData.duracionEstandarMin} minutos</div>
            <div><strong>Tipo de Sala:</strong> {formData.tipoSalaNecesaria}</div>
            <div><strong>Precio:</strong> ${formData.precio?.toLocaleString()}</div>
            <div>
              <strong>Compatibilidad:</strong> 
              {formData.compatibleConEPS && " EPS"}
              {formData.compatibleConEPS && formData.compatibleConPrepagadas && " y"}
              {formData.compatibleConPrepagadas && " Prepagadas"}
              {!formData.compatibleConEPS && !formData.compatibleConPrepagadas && " Ninguna"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
