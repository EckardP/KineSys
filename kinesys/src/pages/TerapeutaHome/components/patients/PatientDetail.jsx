<<<<<<< HEAD

"use client"
=======
>>>>>>> origin

import { ArrowLeft, Phone, Mail, MapPin, Calendar, User, FileText, Shield, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { obtenerEPS } from "../../../../services/epsService"
import { obtenerSeguros } from "../../../../services/segurosService"

export default function PatientDetail({ patient, onBack }) {
  const [eps, setEps] = useState(null)
  const [seguro, setSeguro] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorEps, setErrorEps] = useState(null)
  const [errorSeguro, setErrorSeguro] = useState(null)

  console.log("📋 PatientDetail: Datos del paciente:", patient)
  console.log("🔍 PatientDetail: epsId:", patient?.epsId, "tipo:", typeof patient?.epsId)
  console.log("🔍 PatientDetail: idSeguroMedico:", patient?.idSeguroMedico, "tipo:", typeof patient?.idSeguroMedico)

  useEffect(() => {
    const cargarDatosAdicionales = async () => {
      setLoading(true)
      setErrorEps(null)
      setErrorSeguro(null)
      
      console.log("🔄 PatientDetail: Iniciando carga de datos adicionales...")
      
      try {
        // Cargar EPS si existe epsId
        if (patient?.epsId) {
          console.log(`🔄 PatientDetail: Cargando EPS con ID: ${patient.epsId}`)
          try {
            const epsData = await obtenerEPS(patient.epsId)
            console.log("✅ PatientDetail: EPS cargada:", epsData)
            setEps(epsData)
          } catch (error) {
            console.error("❌ PatientDetail: Error al cargar EPS:", error)
            setErrorEps(error.message)
            setEps(null)
          }
        } else {
          console.log("ℹ️ PatientDetail: No hay epsId, no se cargará EPS")
          setEps(null)
        }

        // Cargar Seguro si existe idSeguroMedico
        if (patient?.idSeguroMedico) {
          console.log(`🔄 PatientDetail: Cargando seguro con ID: ${patient.idSeguroMedico}`)
          try {
            const seguroData = await obtenerSeguros(patient.idSeguroMedico)
            console.log("✅ PatientDetail: Seguro cargado:", seguroData)
            setSeguro(seguroData)
          } catch (error) {
            console.error("❌ PatientDetail: Error al cargar seguro:", error)
            setErrorSeguro(error.message)
            setSeguro(null)
          }
        } else {
          console.log("ℹ️ PatientDetail: No hay idSeguroMedico, no se cargará seguro")
          setSeguro(null)
        }
      } catch (error) {
        console.error("❌ PatientDetail: Error general en carga de datos:", error)
      } finally {
        setLoading(false)
        console.log("🏁 PatientDetail: Carga de datos adicionales finalizada")
        console.log("📊 PatientDetail: Estado final - EPS:", eps, "Seguro:", seguro)
      }
    }

    cargarDatosAdicionales()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient?.epsId, patient?.idSeguroMedico])

  // También verifica los servicios directamente
  useEffect(() => {
    console.log("🔄 PatientDetail: Probando servicios directamente...")
    
    const testServices = async () => {
      try {
        // Test EPS service
        console.log("🧪 Testeando servicio EPS...")
        const testEps = await obtenerEPS(1) // Usa un ID que sepas que existe
        console.log("✅ Servicio EPS funciona:", testEps)
      } catch (error) {
        console.error("❌ Servicio EPS falló:", error)
      }
      
      try {
        // Test Seguros service  
        console.log("🧪 Testeando servicio Seguros...")
        const testSeguro = await obtenerSeguros(1) // Usa un ID que sepas que existe
        console.log("✅ Servicio Seguros funciona:", testSeguro)
      } catch (error) {
        console.error("❌ Servicio Seguros falló:", error)
      }
    }
    
    testServices()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Button onClick={onBack} variant="ghost" className="flex items-center space-x-2">
          <ArrowLeft size={20} />
          <span>Volver</span>
        </Button>
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando información adicional...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="ghost" className="flex items-center space-x-2">
        <ArrowLeft size={20} />
        <span>Volver</span>
      </Button>

      {/* Mostrar errores si los hay */}
      {errorEps && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">
            <strong>Advertencia EPS:</strong> {errorEps}
          </p>
        </div>
      )}

      {errorSeguro && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">
            <strong>Advertencia Seguro:</strong> {errorSeguro}
          </p>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              {patient.nombres} {patient.apellidos}
            </h1>
            <p className="text-gray-600 mt-1">
              {patient.tipoDocumento}: {patient.documentoIdentidad}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información Personal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Información Personal</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Género</p>
                  <p className="font-medium">
                    {patient.genero === 'M' ? 'Masculino' : 
                     patient.genero === 'F' ? 'Femenino' : 
                     patient.genero === 'O' ? 'Otro' : 'No especificado'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                  <p className="font-medium">
                    {patient.fechaNacimiento ? new Date(patient.fechaNacimiento).toLocaleDateString() : 'No especificada'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium">{patient.telefono || "No especificado"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Celular</p>
                  <p className="font-medium">{patient.celular || "No especificado"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{patient.correoElectronico || "No especificado"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información de Contacto y Ubicación */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Ubicación</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p className="font-medium">{patient.direccion || "No especificada"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ciudad</p>
                <p className="font-medium">{patient.ciudad || "No especificada"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Departamento</p>
                <p className="font-medium">{patient.departamento || "No especificada"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información de Aseguramiento */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Información de Aseguramiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Building className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">EPS</p>
                    <p className="font-medium">
                      {eps ? eps.nombreEPS : "No afiliado a EPS"}
                    </p>
                    {patient.epsId && !eps && (
                      <p className="text-xs text-yellow-600">(ID: {patient.epsId})</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Número de Afiliación</p>
                  <p className="font-medium">
                    {patient.numeroDeAfiliacion && patient.numeroDeAfiliacion !== 0 
                      ? patient.numeroDeAfiliacion 
                      : "No especificado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo de Afiliado</p>
                  <p className="font-medium">{patient.tipoAfiliado || "No especificado"}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Régimen</p>
                  <p className="font-medium">{patient.regimen || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado de Afiliación</p>
                  <p className="font-medium">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      patient.estadoAfiliacion 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {patient.estadoAfiliacion ? 'Activo' : 'Inactivo'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha de Afiliación</p>
                  <p className="font-medium">
                    {patient.fechaAfiliacion ? new Date(patient.fechaAfiliacion).toLocaleDateString() : 'No especificada'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seguro Médico */}
        {seguro && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Seguro Médico</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Shield className="text-purple-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Aseguradora</p>
                  <p className="font-medium">{seguro.nombreAseguradora}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Número de Póliza</p>
                <p className="font-medium">{seguro.numeroPoliza}</p>
              </div>
              {seguro.cobertura && (
                <div>
                  <p className="text-sm text-gray-500">Cobertura</p>
                  <p className="font-medium">{seguro.cobertura}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mostrar ID del seguro si existe pero no se pudo cargar */}
        {patient.idSeguroMedico && !seguro && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Seguro Médico</h3>
            <p className="text-gray-600">ID de seguro: {patient.idSeguroMedico} (no se pudo cargar la información)</p>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <Calendar className="text-blue-600" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Citas Programadas</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <FileText className="text-green-600" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Historias Clínicas</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <FileText className="text-purple-600" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Facturas</h3>
              <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
