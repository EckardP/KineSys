import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spinner, Alert, Row, Col, Badge } from "react-bootstrap";
import { obtenerPaciente } from "../../../services/pacientesService";

export default function PacienteCardMini() {
  const { id } = useParams(); // Captura el ID de la URL
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Cargar los datos del paciente al montar el componente
  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        setCargando(true);
        const respuesta = await obtenerPaciente(id);
        setPaciente(respuesta.data || respuesta);
      } catch (err) {
        console.error("Error al obtener paciente:", err);
        setError("No se pudo cargar la información del paciente.");
      } finally {
        setCargando(false);
      }
    };
    fetchPaciente();
  }, [id]);

  if (cargando) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="text-muted mt-2">Cargando información...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center mt-4">
        {error}
      </Alert>
    );
  }

  if (!paciente) {
    return (
      <Alert variant="warning" className="text-center mt-4">
        No se encontró información del paciente.
      </Alert>
    );
  }

  return (
    <div className="container mt-5">
      <Card className="shadow-sm border-0 rounded-4 p-4">
        <Card.Body>
          <Row className="mb-3">
            <Col>
              <h3 className="fw-bold text-primary mb-0">
                {paciente.nombres} {paciente.apellidos}
              </h3>
              <p className="text-muted">#{paciente.documentoIdentidad}</p>
            </Col>
            <Col className="text-end">
              <Badge bg="info" className="fs-6">
                ID: {paciente.id}
              </Badge>
            </Col>
          </Row>

          <hr />

          <Row className="mb-3">
            <Col md={6}>
              <p>
                <strong>📅 Fecha Nacimiento:</strong>{" "}
                {new Date(paciente.fechaNacimiento).toLocaleDateString("es-ES")}
              </p>
              <p>
                <strong>📞 Teléfono:</strong> {paciente.telefono || "—"}
              </p>
              <p>
                <strong>📧 Correo:</strong>{" "}
                {paciente.correoElectronico || "—"}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>⚧ Género:</strong> {paciente.genero || "—"}
              </p>
              <p>
                <strong>🏠 Dirección:</strong> {paciente.direccion || "—"}
              </p>
              <p>
                <strong>🩺 Seguro Médico ID:</strong>{" "}
                {paciente.idSeguroMedico || "—"}
              </p>
            </Col>
          </Row>

          <hr />

          <Row>
            <Col>
              <h5 className="fw-bold text-secondary">Historial Médico</h5>
              <p>{paciente.historialMedico || "No registrado"}</p>
            </Col>
          </Row>

          <Row>
            <Col>
              <h5 className="fw-bold text-secondary">Diagnóstico</h5>
              <p>{paciente.diagnostico || "No registrado"}</p>
            </Col>
          </Row>

          <div className="text-end mt-4">
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              ← Volver
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
