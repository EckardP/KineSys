import { Input } from "./input"

export default {
  title: "UIn-1/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (_Story) => (
      <div className="w-80">
        <_Story />
      </div>
    ),
  ],
  args: {
    placeholder: "Nombre del paciente",
  },
}

export const Empty = {}

export const Filled = {
  args: {
    defaultValue: "Andrea Gomez",
  },
}

export const Disabled = {
  args: {
    defaultValue: "Documento bloqueado",
    disabled: true,
  },
}
