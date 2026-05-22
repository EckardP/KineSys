import { AlertTriangle, CalendarDays, CheckCircle2, Info, XCircle } from "lucide-react"

const palette = [
  { name: "Primario", token: "--primary-dark", usage: "Acciones principales y encabezados oscuros" },
  { name: "Secundario", token: "--secondary-dark", usage: "Hover y superficies oscuras secundarias" },
  { name: "Fondo claro", token: "--light-gray", usage: "Fondo general de la aplicacion" },
  { name: "Gris medio", token: "--medium-gray", usage: "Separadores y superficies neutras" },
  { name: "Borde", token: "--border-gray", usage: "Controles, tablas y contenedores" },
  { name: "Exito", token: "--success-color", usage: "Confirmaciones" },
  { name: "Error", token: "--danger-color", usage: "Errores y acciones destructivas" },
  { name: "Advertencia", token: "--warning-color", usage: "Alertas preventivas" },
  { name: "Informacion", token: "--info-color", usage: "Mensajes informativos" },
]

const textTokens = [
  { name: "Texto principal", token: "--text-primary" },
  { name: "Texto secundario", token: "--text-secondary" },
  { name: "Texto tenue", token: "--text-muted" },
]

const shadows = [
  { name: "Sombra pequena", token: "--shadow-sm" },
  { name: "Sombra media", token: "--shadow-md" },
  { name: "Sombra grande", token: "--shadow-lg" },
]

const StatusSample = ({ icon, label, color }) => (
  <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm shadow-sm">
    <span style={{ color }}>{icon}</span>
    <span>{label}</span>
  </div>
)

export default {
  title: "UIn-1/Visual Foundations",
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
}

export const DesignSystemOverview = {
  render: () => (
    <main className="min-h-screen bg-gray-50 px-6 py-8 text-gray-900 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <header className="flex flex-col gap-3 border-b border-gray-200 pb-6">
          <p className="text-sm font-semibold uppercase text-gray-500">KineSys UIn-1</p>
          <h1 className="text-4xl font-bold">Fundamentos visuales</h1>
          <p className="max-w-3xl text-base text-gray-600">
            Vista de referencia para revisar paleta, tipografia, espaciado, bordes, sombras y estados visuales.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Paleta de colores</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {palette.map((color) => (
              <article key={color.token} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="h-24 border-b" style={{ backgroundColor: `var(${color.token})` }} />
                <div className="flex flex-col gap-1 p-4">
                  <strong>{color.name}</strong>
                  <code className="text-sm text-gray-500">{color.token}</code>
                  <p className="text-sm text-gray-600">{color.usage}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-semibold">Tipografia y jerarquia</h2>
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-bold">Panel del Administrador</h1>
              <h2 className="text-2xl font-semibold">Citas programadas</h2>
              <h3 className="text-xl font-semibold">Datos del paciente</h3>
              <p className="text-base">Texto base para lectura, formularios y descripciones operativas.</p>
              <label className="text-sm font-medium">Etiqueta de campo</label>
              <p className="text-sm text-gray-500">Texto secundario para ayuda y metadatos.</p>
            </div>
          </article>

          <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-semibold">Texto y contraste</h2>
            <div className="flex flex-col gap-3">
              {textTokens.map((text) => (
                <div key={text.token} className="rounded-lg border px-4 py-3" style={{ color: `var(${text.token})` }}>
                  <strong>{text.name}</strong>
                  <p className="mb-0 text-sm">{text.token}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-semibold">Espaciado y bordes</h2>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-[5rem_1fr] items-center gap-4">
                <code>8px</code>
                <div className="h-4 w-8 rounded bg-gray-900" />
              </div>
              <div className="grid grid-cols-[5rem_1fr] items-center gap-4">
                <code>16px</code>
                <div className="h-4 w-16 rounded bg-gray-700" />
              </div>
              <div className="grid grid-cols-[5rem_1fr] items-center gap-4">
                <code>24px</code>
                <div className="h-4 w-24 rounded bg-gray-500" />
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="rounded-md border px-4 py-2">Radio md</span>
                <span className="rounded-lg border px-4 py-2">Radio lg</span>
                <span className="rounded-xl border px-4 py-2">Card actual</span>
              </div>
            </div>
          </article>

          <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-semibold">Sombras</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {shadows.map((shadow) => (
                <div
                  key={shadow.token}
                  className="flex min-h-32 flex-col justify-end rounded-lg border bg-white p-4"
                  style={{ boxShadow: `var(${shadow.token})` }}
                >
                  <strong className="text-sm">{shadow.name}</strong>
                  <code className="text-xs text-gray-500">{shadow.token}</code>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-2xl font-semibold">Estados visuales</h2>
          <div className="flex flex-wrap gap-3">
            <StatusSample icon={<CheckCircle2 size={18} />} label="Confirmacion" color="var(--success-color)" />
            <StatusSample icon={<XCircle size={18} />} label="Error" color="var(--danger-color)" />
            <StatusSample icon={<AlertTriangle size={18} />} label="Advertencia" color="var(--warning-color)" />
            <StatusSample icon={<Info size={18} />} label="Informacion" color="var(--info-color)" />
            <StatusSample icon={<CalendarDays size={18} />} label="Accion operativa" color="var(--primary-dark)" />
          </div>
        </section>
      </div>
    </main>
  ),
}
