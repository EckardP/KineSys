"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../../context/AuthContext"
import { evolucionesPacienteApi } from "../../../api/evolucionesPaciente"

export default function MedicalHistory() {
  const { usuario } = useContext(AuthContext)
  const [evoluciones, setEvoluciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvolucion, setSelectedEvolucion] = useState(null)

  useEffect(() => {
    const fetchEvoluciones = async () => {
      try {
        const todasLasEvoluciones = await evolucionesPacienteApi.getAll()

        // Filtrar evoluciones del paciente actual
        const evolucionesPaciente = todasLasEvoluciones.filter((e) => e.pacienteId === usuario?.id)

        // Ordenar por fecha descendente (más recientes primero)
        evolucionesPaciente.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

        setEvoluciones(evolucionesPaciente)
      } catch (error) {
        console.error("Error al cargar evoluciones:", error)
      } finally {
        setLoading(false)
      }
    }

    if (usuario?.id) {
      fetchEvoluciones()
    }
  }, [usuario?.id])

  return (
    <div className="history-card">
      <div className="card-header">
        <h3>Historial Médico</h3>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Cargando historial...</p>
        </div>
      ) : evoluciones.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">📄</p>
          <p className="empty-text">No hay registros de evolución aún</p>
        </div>
      ) : (
        <div className="history-list">
          {evoluciones.map((evolucion) => (
            <div key={evolucion.id} className="history-item" onClick={() => setSelectedEvolucion(evolucion)}>
              <div className="history-date">{new Date(evolucion.fecha).toLocaleDateString("es-ES")}</div>
              <div className="history-content">
                <h4 className="history-title">{evolucion.titulo || "Registro de Evolución"}</h4>
                <p className="history-preview">{evolucion.descripcion?.substring(0, 80)}...</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEvolucion && (
        <EvolucionDetail evolucion={selectedEvolucion} onClose={() => setSelectedEvolucion(null)} />
      )}
    </div>
  )
}

function EvolucionDetail({ evolucion, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>{evolucion.titulo || "Evolución Médica"}</h2>

        <div className="detail-section">
          <div className="detail-item">
            <label>Fecha</label>
            <p>
              {new Date(evolucion.fecha).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {evolucion.diagnostico && (
            <div className="detail-item full-width">
              <label>Diagnóstico</label>
              <p>{evolucion.diagnostico}</p>
            </div>
          )}

          <div className="detail-item full-width">
            <label>Descripción</label>
            <p>{evolucion.descripcion}</p>
          </div>

          {evolucion.observaciones && (
            <div className="detail-item full-width">
              <label>Observaciones</label>
              <p>{evolucion.observaciones}</p>
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
