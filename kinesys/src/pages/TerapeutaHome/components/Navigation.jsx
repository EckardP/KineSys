"use client"

import { useState } from "react"
import { Home, Users, Calendar, FileText, CreditCard, Shield, LogOut, Menu, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function Navigation({ currentPage, setCurrentPage }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAuth()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "pacientes", label: "Pacientes", icon: Users },
    { id: "citas", label: "Citas", icon: Calendar },
    { id: "historias", label: "Historias", icon: FileText },
    { id: "facturacion", label: "Facturación", icon: CreditCard },
    { id: "auditoria", label: "Auditoría", icon: Shield },
  ]

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav
      className={`fixed left-0 top-0 h-screen bg-black text-white transition-all duration-300 z-50 ${isCollapsed ? "w-20" : "w-64"}`}
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <h1 className="text-xl font-bold">KineSys</h1>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-primary/80 rounded">
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <div className="px-2 py-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded transition-colors ${
                currentPage === item.id ? "bg-white bg-opacity-50" : "hover:bg-gray-800 hover:bg-opacity-30"
              }`}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </div>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded hover:bg-gray-800 hover:bg-opacity-20 transition-colors"
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Salir</span>}
        </button>
      </div>
    </nav>
  )
}
