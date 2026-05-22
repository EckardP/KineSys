import { Alert, AlertDescription, AlertTitle } from "./alert"

export default {
  title: "UIn-1/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (_Story) => (
      <div className="w-[28rem]">
        <_Story />
      </div>
    ),
  ],
}

export const Informative = {
  render: () => (
    <Alert>
      <AlertTitle>Cita confirmada</AlertTitle>
      <AlertDescription>La sesion aparece en la agenda del terapeuta.</AlertDescription>
    </Alert>
  ),
}

export const ErrorState = {
  render: () => (
    <Alert variant="destructive">
      <AlertTitle>No se pudo guardar</AlertTitle>
      <AlertDescription>Revisa los campos obligatorios antes de continuar.</AlertDescription>
    </Alert>
  ),
}
