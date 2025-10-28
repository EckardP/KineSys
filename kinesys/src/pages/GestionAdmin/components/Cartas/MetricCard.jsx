import "./MetricCard.css"

export default function MetricCard({ title, value, icon }) {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        <div className="metric-icon">{icon}</div>
      </div>
      <div className="metric-value">{value}</div>
    </div>
  )
}
