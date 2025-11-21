"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import PatientForm from "./PatientForm"
import PatientDetail from "./PatientDetail"

export default function PatientList() {
  const [patients, setPatients] = useState([
    { id: 1, cedula: "1234567890", nombres: "Juan", apellidos: "García", telefono: "3101234567", eps: "Sura" },
    { id: 2, cedula: "9876543210", nombres: "María", apellidos: "López", telefono: "3107654321", eps: "EPS Cafeteros" },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [editingPatient, setEditingPatient] = useState(null)

  const filteredPatients = patients.filter(
    (p) => p.nombres.toLowerCase().includes(searchTerm.toLowerCase()) || p.cedula.includes(searchTerm),
  )

  const handleAddPatient = (newPatient) => {
    if (editingPatient) {
      setPatients(patients.map((p) => (p.id === editingPatient.id ? { ...newPatient, id: p.id } : p)))
      setEditingPatient(null)
    } else {
      setPatients([...patients, { ...newPatient, id: Date.now() }])
    }
    setShowForm(false)
  }

  const handleDeletePatient = (id) => {
    if (confirm("¿Está seguro que desea eliminar este paciente?")) {
      setPatients(patients.filter((p) => p.id !== id))
    }
  }

  if (selectedPatient) {
    return <PatientDetail patient={selectedPatient} onBack={() => setSelectedPatient(null)} />
  }

  if (showForm) {
    return (
      <PatientForm
        onSubmit={handleAddPatient}
        onCancel={() => {
          setShowForm(false)
          setEditingPatient(null)
        }}
        initialData={editingPatient}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Pacientes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary/90"
        >
          <Plus size={20} />
          <span>Nuevo Paciente</span>
        </button>
      </div>

      <div className="bg-card p-4 rounded-lg border">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o cédula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          />
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Cédula</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Teléfono</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">EPS</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="border-b hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{patient.cedula}</td>
                <td className="px-6 py-4 text-sm">
                  {patient.nombres} {patient.apellidos}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{patient.telefono}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{patient.eps}</td>
                <td className="px-6 py-4 text-sm space-x-2 flex items-center">
                  <button
                    onClick={() => setSelectedPatient(patient)}
                    className="p-2 hover:bg-blue-50 text-primary rounded transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingPatient(patient)
                      setShowForm(true)
                    }}
                    className="p-2 hover:bg-green-50 text-green-600 rounded transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeletePatient(patient.id)}
                    className="p-2 hover:bg-red-50 text-destructive rounded transition-colors"
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
