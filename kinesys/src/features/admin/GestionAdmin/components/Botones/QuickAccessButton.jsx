import "./QuickAccessButton.css"
import { useNavigate } from "react-router-dom"

export default function QuickAccessButton({ label, path, icon }) {
  const navigate = useNavigate()

  return (
    <button className="quick-button" onClick={() => navigate(path)}>
      <div className="quick-icon">{icon}</div>
      <span className="quick-label">{label}</span>
    </button>
  )
}
