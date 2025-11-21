"use client"

import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PatientDetail({ patient, onBack }) {
  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="ghost" className="flex items-center space-x-2">
        <ArrowLeft size={20} />
        <span>Volver</span>
      </Button>

      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              {patient.nombres} {patient.apellidos}
            </h1>
            <p className="text-muted-foreground mt-1">Cédula: {patient.cedula}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Información de Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="text-primary" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p>{patient.telefono}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-primary" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{patient.email || "No especificado"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-primary" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <p>{patient.direccion || "No especificada"}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Información de Aseguramiento</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">EPS</p>
                <p className="font-medium">{patient.eps}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Número de Afiliación</p>
                <p className="font-medium">{patient.numeroAfiliacion || "No especificado"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Citas Programadas</h3>
          <p className="text-3xl font-bold text-primary">3</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Historias Clínicas</h3>
          <p className="text-3xl font-bold text-secondary">2</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Facturas</h3>
          <p className="text-3xl font-bold text-accent">5</p>
        </div>
      </div>
    </div>
  )
}
