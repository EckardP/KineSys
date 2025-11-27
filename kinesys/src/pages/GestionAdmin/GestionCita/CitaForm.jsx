// src/pages/GestionCita/CitaForm.jsx
"use client"

import { useState, useEffect } from "react"
import { Calendar, ArrowLeft, Save } from "lucide-react"
import CitaServiceSelection from "./CitaServiceSelection"
import CitaPatientSelection from "./CitaPatientSelection"
import CitaTherapistSelection from "./CitaTherapistSelection"
import CitaScheduleSelection from "./CitaScheduleSelection"
import CitaConfirmation from "./CitaConfirmation"
import { crearCita, actualizarCita } from "../../../services/citasService"

const steps = [
  { id: 1, name: "Servicio", description: "Selecciona el tipo de servicio" },
  { id: 2, name: "Paciente", description: "Selecciona el paciente" },
  { id: 3, name: "Terapeuta", description: "Selecciona el terapeuta" },
  { id: 4, name: "Horario", description: "Selecciona fecha y hora" },
  { id: 5, name: "Confirmar", description: "Revisa y confirma" }
]

export default function CitaForm({ onCancel, onSubmitSuccess, initialData }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [citaData, setCitaData] = useState({
    // Información básica
    idTipoServicio: null,
    idPaciente: null,
    idTerapeuta: null,
    fechaHora: null,
    
    // Detalles del servicio
    duracionProgramadaMin: 30,
    precioBase: 0,
    agregadoPrecio: 0,
    precioCita: 0,
    
    // Información adicional
    tipoAtencion: "",
    motivo: "",
    estado: "Pendiente",
    
    // Relaciones
    idSala: null,
    idOrdenMedica: null,
    idAutorizacion: null,
    idEPS: null,
    copago: 0,
    confirmada: false
  })

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (initialData) {
      setCitaData({
        ...initialData,
        fechaHora: initialData.fechaHora ? new Date(initialData.fechaHora).toISOString() : null
      })
    }
  }, [initialData])

  const updateCitaData = (newData) => {
    setCitaData(prev => ({
      ...prev,
      ...newData,
      // Calcular precio total automáticamente
      precioCita: newData.precioBase !== undefined || newData.agregadoPrecio !== undefined 
        ? (newData.precioBase || prev.precioBase) + (newData.agregadoPrecio || prev.agregadoPrecio)
        : prev.precioCita
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const goToStep = (step) => {
    setCurrentStep(step)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      console.log("🔄 Enviando datos de cita:", citaData)

      const datosParaEnviar = {
        ...citaData,
        duracionProgramadaMin: Number(citaData.duracionProgramadaMin) || 30,
        precioCita: Number(citaData.precioCita) || 0,
        copago: Number(citaData.copago) || 0,
        confirmada: citaData.estado === "Confirmada",
        // Campos que deben ser null si no tienen valor
        idSala: citaData.idSala || null,
        idOrdenMedica: citaData.idOrdenMedica || null,
        idAutorizacion: citaData.idAutorizacion || null,
        idEPS: citaData.idEPS || null
      }

      let resultado
      if (initialData?.idCita) {
        resultado = await actualizarCita(initialData.idCita, datosParaEnviar)
      } else {
        resultado = await crearCita(datosParaEnviar)
      }

      console.log("✅ Cita guardada exitosamente:", resultado)
      onSubmitSuccess(resultado)
    } catch (error) {
      console.error("❌ Error al guardar cita:", error)
      alert(error.message || "Error al guardar la cita")
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CitaServiceSelection
            citaData={citaData}
            updateCitaData={updateCitaData}
            onNext={nextStep}
          />
        )
      case 2:
        return (
          <CitaPatientSelection
            citaData={citaData}
            updateCitaData={updateCitaData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 3:
        return (
          <CitaTherapistSelection
            citaData={citaData}
            updateCitaData={updateCitaData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 4:
        return (
          <CitaScheduleSelection
            citaData={citaData}
            updateCitaData={updateCitaData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 5:
        return (
          <CitaConfirmation
            citaData={citaData}
            updateCitaData={updateCitaData}
            onBack={prevStep}
            onSubmit={handleSubmit}
            loading={loading}
            isEditing={!!initialData}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <Calendar className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {initialData ? "Editar Cita" : "Nueva Cita"}
            </h1>
          </div>
          <p className="text-gray-600">
            {initialData 
              ? "Modifica los datos de la cita existente" 
              : "Completa los pasos para agendar una nueva cita"
            }
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(step.id)}
                  className={`flex flex-col items-center ${
                    currentStep >= step.id ? 'text-indigo-600' : 'text-gray-400'
                  } ${index < steps.length - 1 ? 'flex-1' : ''}`}
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-2
                    ${currentStep >= step.id 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-400'
                    }
                    ${currentStep === step.id ? 'ring-4 ring-indigo-100' : ''}
                  `}>
                    {step.id}
                  </div>
                  <span className="text-sm font-medium">{step.name}</span>
                  <span className="text-xs text-gray-500 mt-1">{step.description}</span>
                </button>
                
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-1 mx-4
                    ${currentStep > step.id ? 'bg-indigo-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="border-t border-gray-200 pt-6">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  )
}