import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import {
  crearPacientes,
  actualizarPacientes,
  obtenerPacientes,
} from "../../services/pacientesService";

export default function FormPaciente() {
  const navigate = useNavigate();
  const { id } = useParams(); // Si existe, es edición
  const esEdicion = !!id;

  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    fechaNacimiento: "",
    genero: "",
    telefono: "",
    correoElectronico: "",
    direccion: "",
    historialMedico: "",
    idSeguroMedico: "",
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  // ✅ Si es edición, obtener datos del paciente
  useEffect(() => {
    if (esEdicion) {
      cargarPaciente();
    }
  }, [id]);

  const cargarPaciente = async () => {
    try {
      setCargando(true);
      const respuesta = await obtenerPacientes(id);
      setFormData({
        nombreCompleto: respuesta.data.nombreCompleto || "",
        fechaNacimiento: respuesta.data.fechaNacimiento?.split("T")[0] || "",
        genero: respuesta.data.genero || "",
        telefono: respuesta.data.telefono || "",
        correoElectronico: respuesta.data.correoElectronico || "",
        direccion: respuesta.data.direccion || "",
        historialMedico: respuesta.data.historialMedico || "",
        idSeguroMedico: respuesta.data.idSeguroMedico || "",
      });
      setCargando(false);
    } catch (err) {
      console.error("Error al obtener paciente:", err);
      setError("No se pudieron cargar los datos del paciente.");
      setCargando(false);
    }
  };

  // --- Manejar cambios en los campos ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Enviar formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
     console.log("Payload a enviar:", formData);
    setError(null);
    setExito(null);
    setCargando(true);

    const payload = {
        NombreCompleto: formData.nombreCompleto,
        FechaNacimiento: formData.fechaNacimiento || null,
        Genero: formData.genero || "",
        Telefono: formData.telefono || "",
        CorreoElectronico: formData.correoElectronico || "",
        Direccion: formData.direccion || "",
        HistorialMedico: formData.historialMedico || "Sin historial",
        IdSeguroMedico: formData.idSeguroMedico ? parseInt(formData.idSeguroMedico) : null
    };

    try {
      if (esEdicion) {
        await actualizarPacientes(id, formData);
        setExito("Paciente actualizado correctamente.");
      } else {
        await crearPacientes(JSON.stringify(payload));

        setExito("Paciente registrado exitosamente.");
      }

      // Esperar un poco y volver al listado
      setTimeout(() => navigate("/pacientes"), 1500);
    } catch (err) {
      console.error("Error al guardar paciente:", err);
      setError("Ocurrió un error al guardar el paciente.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">
            {esEdicion ? "Editar Paciente" : "Registrar Nuevo Paciente"}
          </h2>
          <p className="text-muted">
            {esEdicion
              ? "Modifica los datos del paciente seleccionado."
              : "Completa los campos para registrar un nuevo paciente."}
          </p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {exito && <Alert variant="success">{exito}</Alert>}

      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Cargando datos...</p>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="nombreCompleto">
                <Form.Label>Nombre Completo *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group controlId="fechaNacimiento">
                <Form.Label>Fecha de Nacimiento *</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group controlId="genero">
                <Form.Label>Género *</Form.Label>
                <Form.Select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="telefono">
                <Form.Label>Teléfono *</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="correoElectronico">
                <Form.Label>Correo Electrónico *</Form.Label>
                <Form.Control
                  type="email"
                  name="correoElectronico"
                  value={formData.correoElectronico}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="idSeguroMedico">
                <Form.Label>Seguro Médico (opcional)</Form.Label>
                <Form.Control
                  type="number"
                  name="idSeguroMedico"
                  value={formData.idSeguroMedico}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="direccion">
                <Form.Label>Dirección *</Form.Label>
                <Form.Control
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="historialMedico">
                <Form.Label>Historial Médico (opcional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="historialMedico"
                  value={formData.historialMedico}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-4">
            <Button
              variant="secondary"
              className="me-2"
              onClick={() => navigate("/pacientes")}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={cargando}>
              {esEdicion ? "Guardar Cambios" : "Registrar Paciente"}
            </Button>
          </div>
        </Form>
      )}
    </Container>
  );
}
