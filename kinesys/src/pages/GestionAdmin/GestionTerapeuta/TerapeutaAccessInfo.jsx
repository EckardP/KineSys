"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Lock } from "lucide-react"

export default function TerapeutaAccessInfo({ formData, onChange, isEditing }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
        <User className="w-5 h-5 text-indigo-600" />
        Información de Acceso
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="user" className="text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            Usuario *
          </Label>
          <Input
            id="user"
            name="user"
            value={formData.user}
            onChange={onChange}
            placeholder="Nombre de usuario único"
            className="border-gray-300"
          />
          <p className="text-xs text-gray-500 mt-1">
            El nombre de usuario debe ser único en el sistema
          </p>
        </div>
        <div>
          <Label htmlFor="password" className="text-gray-700 flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-500" />
            Contraseña {!isEditing && "*"}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={onChange}
            placeholder={isEditing ? "Dejar en blanco para mantener la actual" : "Contraseña del usuario"}
            className="border-gray-300"
          />
          <p className="text-xs text-gray-500 mt-1">
            {isEditing 
              ? "Complete solo si desea cambiar la contraseña"
              : "La contraseña debe tener al menos 6 caracteres"
            }
          </p>
        </div>
      </div>
    </div>
  )
}