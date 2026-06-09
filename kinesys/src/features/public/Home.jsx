import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  FileBarChart,
  Stethoscope,
  UserRoundCheck,
  Users,
} from "lucide-react"
import { Link } from "react-router-dom"

const modules = [
  {
    icon: Users,
    title: "Pacientes",
    text: "Registro, historia clínica, documentos y seguimiento en una vista fácil de consultar.",
  },
  {
    icon: UserRoundCheck,
    title: "Terapeutas",
    text: "Disponibilidad, especialidades y agenda profesional conectadas con cada atención.",
  },
  {
    icon: Stethoscope,
    title: "Tratamientos",
    text: "Protocolos, servicios, equipos y salas organizados para programar sin fricción.",
  },
  {
    icon: FileBarChart,
    title: "Reportes",
    text: "Indicadores operativos para revisar ocupación, asistencia y desempeño de la clínica.",
  },
]

const workflow = [
  "Paciente registrado",
  "Cita asignada",
  "Sesión atendida",
  "Reporte actualizado",
]

const panelItems = [
  {
    icon: Users,
    title: "Pacientes",
    text: "Registro, consulta e historial clínico.",
  },
  {
    icon: CalendarCheck2,
    title: "Agenda",
    text: "Programación y seguimiento de citas.",
  },
  {
    icon: Stethoscope,
    title: "Tratamientos",
    text: "Protocolos, servicios y recursos clínicos.",
  },
  {
    icon: FileBarChart,
    title: "Reportes",
    text: "Indicadores y trazabilidad operativa.",
  },
]

export default function Home() {
  return (
    <div className="home-shell">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <span className="home-eyebrow">Gestión clínica para fisioterapia</span>
          <h1 id="home-title">KineSys centraliza la operación diaria de la clínica.</h1>
          <p>
            Una plataforma ordenada para coordinar pacientes, terapeutas, citas,
            tratamientos y reportes con trazabilidad desde el primer contacto.
          </p>

          <div className="home-actions" aria-label="Acciones principales">
            <Link to="/login" className="home-primary-action">
              Acceder al sistema
              <ArrowRight size={18} />
            </Link>
            <a href="#modulos" className="home-secondary-action">
              Ver módulos
            </a>
          </div>
        </div>

        <div className="home-product-panel" aria-label="Resumen visual de módulos de KineSys">
          <div className="home-panel-header">
            <span>
              <ClipboardList size={18} />
              Módulos de trabajo
            </span>
          </div>

          <div className="home-panel-grid">
            {panelItems.map((item) => {
              const ItemIcon = item.icon

              return (
                <div className="home-panel-module" key={item.title}>
                  <span className="home-row-icon">
                    <ItemIcon size={18} />
                  </span>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="modulos" className="home-modules" aria-label="Módulos principales">
        <div className="home-section-heading">
          <span className="home-eyebrow">Módulos principales</span>
          <h2>Un flujo claro para administrar la atención.</h2>
          <p>Las áreas críticas quedan separadas, pero conectadas por la misma información.</p>
        </div>

        <div className="home-module-grid">
          {modules.map((module) => {
            const ModuleIcon = module.icon

            return (
              <article className="home-module-card" key={module.title}>
                <span className="home-module-icon">
                  <ModuleIcon size={22} />
                </span>
                <h3>{module.title}</h3>
                <p>{module.text}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="home-workflow" aria-label="Flujo de atención">
        <div className="home-workflow-copy">
          <span className="home-eyebrow">Proceso controlado</span>
          <h2>De la cita al reporte sin perder continuidad.</h2>
        </div>
        <ol>
          {workflow.map((step) => (
            <li key={step}>
              <CheckCircle2 size={18} />
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
