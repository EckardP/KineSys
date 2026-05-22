import { CalendarDays, Trash2 } from "lucide-react"

import { Button } from "./button"

export default {
  title: "UIn-1/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    children: "Guardar paciente",
  },
}

export const Primary = {}

export const Secondary = {
  args: {
    variant: "secondary",
    children: "Ver agenda",
  },
}

export const Outline = {
  args: {
    variant: "outline",
    children: (
      <>
        <CalendarDays />
        Programar cita
      </>
    ),
  },
}

export const Destructive = {
  args: {
    variant: "destructive",
    children: (
      <>
        <Trash2 />
        Eliminar
      </>
    ),
  },
}

export const Disabled = {
  args: {
    disabled: true,
    children: "Guardando...",
  },
}
