"use client"

import { useState } from "react"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import Navigation from "./components/Navigation"
import Dashboard from "./components/Dashboard"
import PatientList from "./components/patients/PatientList"
import AppointmentList from "./components/appointments/AppointmentList"
import ClinicalHistoryList from "./components/histories/ClinicalHistoryList"
import InvoiceList from "./components/billing/InvoiceList"
import AuditDashboard from "./components/audit/AuditDashboard"

export default function TerapeutaHome() {
  useRequireAuth(2) // Rol 2 = Terapeuta
  const [currentPage, setCurrentPage] = useState("dashboard")

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="ml-64 p-6">
        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "pacientes" && <PatientList />}
        {currentPage === "citas" && <AppointmentList />}
        {currentPage === "historias" && <ClinicalHistoryList />}
        {currentPage === "facturacion" && <InvoiceList />}
        {currentPage === "auditoria" && <AuditDashboard />}
      </main>
    </div>
  )
}
