"use client"

export default function AppointmentDetail({ cita, onClose }) {
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatearHora = (fecha) => {
    return new Date(fecha).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>Detalles de la Cita</h2>

        <div className="detail-section">
          <div className="detail-item">
            <label>Tipo de Cita</label>
            <p>{cita.tipo || "Cita de Fisioterapia"}</p>
          </div>

          <div className="detail-item">
            <label>Fecha</label>
            <p>{formatearFecha(cita.fecha)}</p>
          </div>

          <div className="detail-item">
            <label>Hora</label>
            <p>{formatearHora(cita.fecha)}</p>
          </div>

          <div className="detail-item">
            <label>Terapeuta</label>
            <p>{cita.terapeutaNombre || "Por asignar"}</p>
          </div>

          <div className="detail-item">
            <label>Consultorio</label>
            <p>{cita.consultorio || "No especificado"}</p>
          </div>

          {cita.notas && (
            <div className="detail-item full-width">
              <label>Notas</label>
              <p>{cita.notas}</p>
            </div>
          )}
        </div>

        <button className="modal-action-btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  )
}
