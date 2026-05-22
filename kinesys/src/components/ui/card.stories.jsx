import { Button } from "./button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"

export default {
  title: "UIn-1/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export const PatientSummary = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Paciente en seguimiento</CardTitle>
        <CardDescription>Resumen visual para validar jerarquia, bordes y espaciado.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">Proxima cita: 24 de mayo, 9:00 a.m.</p>
        <p className="text-sm">Plan activo: Rehabilitacion de rodilla</p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Ver ficha</Button>
        <Button>Registrar sesion</Button>
      </CardFooter>
    </Card>
  ),
}
