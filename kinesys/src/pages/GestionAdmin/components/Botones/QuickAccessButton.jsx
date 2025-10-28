import "./QuickAccessButton.css"

export default function QuickAccessButton({ label, path, icon }) {
  return (
    <button className="quick-button" onClick={() => (window.location.href = path)}>
      <div className="quick-icon">{icon}</div>
      <span className="quick-label">{label}</span>
    </button>
  )
}
