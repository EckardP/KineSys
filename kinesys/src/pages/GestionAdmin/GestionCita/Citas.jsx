import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// Importa tus servicios reales aquí:
import {
  listarCitas,
  crearCita,
  actualizarCita,
  eliminarCita,
} from "../../../services/citasService";

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState({
    idCita: "",
    duracionProgramadaMin: "",
    horaInicioReal: "",
    horaFinReal: "",
    checkIn: "",
    checkOut: "",
    confirmada: false,
    estado: "",
    idPaciente: "",
    idTerapeuta: "",
    idTratamiento: "",
  });

  // 🔹 Cargar citas al iniciar
  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      const data = await listarCitas();
      setCitas(data || []);
    } catch (error) {
      console.error("Error al listar citas:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔹 Registrar o actualizar cita
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cita = {
        ...formData,
        idCita: formData.idCita ? Number(formData.idCita) : 0,
        duracionProgramadaMin: Number(formData.duracionProgramadaMin),
        idPaciente: Number(formData.idPaciente),
        idTerapeuta: Number(formData.idTerapeuta),
        idTratamiento: Number(formData.idTratamiento),
        horaInicioReal: new Date(formData.horaInicioReal).toISOString(),
        horaFinReal: new Date(formData.horaFinReal).toISOString(),
        checkIn: new Date(formData.checkIn).toISOString(),
        checkOut: new Date(formData.checkOut).toISOString(),
      };

      if (modoEdicion) {
        await actualizarCita(cita.idCita, cita);
      } else {
        await crearCita(cita);
      }

      await cargarCitas();
      limpiarFormulario();
    } catch (error) {
      console.error("Error al guardar cita:", error);
      alert(error.message || "Error al guardar cita");
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      idCita: "",
      duracionProgramadaMin: "",
      horaInicioReal: "",
      horaFinReal: "",
      checkIn: "",
      checkOut: "",
      confirmada: false,
      estado: "",
      idPaciente: "",
      idTerapeuta: "",
      idTratamiento: "",
    });
    setModoEdicion(false);
  };

  const handleEdit = (cita) => {
    setFormData({
      ...cita,
      horaInicioReal: cita.horaInicioReal?.split("T")[0] || "",
      horaFinReal: cita.horaFinReal?.split("T")[0] || "",
      checkIn: cita.checkIn?.split("T")[0] || "",
      checkOut: cita.checkOut?.split("T")[0] || "",
    });
    setModoEdicion(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta cita?")) {
      try {
        await eliminarCita(id);
        await cargarCitas();
      } catch (error) {
        console.error("Error al eliminar cita:", error);
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h1 className="fw-bold">Gestión de Citas</h1>
        <p className="text-muted">
          Registra, visualiza o modifica las citas agendadas.
        </p>
      </div>

      {/* --- FORMULARIO --- */}
      <div className="card shadow-sm p-4 mb-5">
        <h4 className="mb-3">{modoEdicion ? "Editar Cita" : "Registrar Cita"}</h4>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Paciente (ID)</label>
            <input
              type="number"
              className="form-control"
              name="idPaciente"
              value={formData.idPaciente}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Terapeuta (ID)</label>
            <input
              type="number"
              className="form-control"
              name="idTerapeuta"
              value={formData.idTerapeuta}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Tratamiento (ID)</label>
            <input
              type="number"
              className="form-control"
              name="idTratamiento"
              value={formData.idTratamiento}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Hora de Inicio</label>
            <input
              type="datetime-local"
              className="form-control"
              name="horaInicioReal"
              value={formData.horaInicioReal}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Hora de Fin</label>
            <input
              type="datetime-local"
              className="form-control"
              name="horaFinReal"
              value={formData.horaFinReal}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Check-In</label>
            <input
              type="datetime-local"
              className="form-control"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Check-Out</label>
            <input
              type="datetime-local"
              className="form-control"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Duración (min)</label>
            <input
              type="number"
              className="form-control"
              name="duracionProgramadaMin"
              value={formData.duracionProgramadaMin}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Estado</label>
            <input
              type="text"
              className="form-control"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 d-flex align-items-center">
            <div className="form-check mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                name="confirmada"
                checked={formData.confirmada}
                onChange={handleChange}
              />
              <label className="form-check-label">Confirmada</label>
            </div>
          </div>

          <div className="col-12 text-end mt-3">
            <button type="submit" className="btn btn-primary me-2">
              {modoEdicion ? "Actualizar" : "Registrar"}
            </button>
            {modoEdicion && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={limpiarFormulario}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- TABLA DE CITAS --- */}
      <div className="card shadow-sm p-3">
        <h4 className="mb-3">Citas Registradas</h4>

        {citas.length === 0 ? (
          <p className="text-muted">No hay citas registradas.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Paciente</th>
                  <th>Terapeuta</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Duración</th>
                  <th>Estado</th>
                  <th>Confirmada</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((cita, i) => (
                  <tr key={i}>
                    <td>{cita.idCita}</td>
                    <td>{cita.idPaciente}</td>
                    <td>{cita.idTerapeuta}</td>
                    <td>{new Date(cita.horaInicioReal).toLocaleString()}</td>
                    <td>{new Date(cita.horaFinReal).toLocaleString()}</td>
                    <td>{cita.duracionProgramadaMin} min</td>
                    <td>{cita.estado}</td>
                    <td>{cita.confirmada ? "Sí" : "No"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(cita)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(cita.idCita)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
