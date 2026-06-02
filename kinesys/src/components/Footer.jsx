import { Activity } from "lucide-react"

export default function Footer() {
  return (
    <footer className="ks-footer">
      <div className="ks-footer-inner">
        <Activity size={16} aria-hidden="true" />
        <span>{new Date().getFullYear()} KineSys - Sistema de gestion de fisioterapia</span>
      </div>
    </footer>
  )
}
