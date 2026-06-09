import React, { useState } from "react";
import { Container, Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { crearFisioterapeuta } from "@/services/fisioterapeutasService";

export default function FormFisioterapeuta() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    documentoIdentidad: "",
    tarjetaProfesional: "",
    especialidades: "",
    telefono: "",
    correoElectronico: "",
    horarioDisponibilidad: "",
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [erroresValidacion, setErroresValidacion] = useState({});

  const validarCorreo = (correo) => {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correo);
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombres.trim()) {
      nuevosErrores.nombres = "Los nombres son obligatorios.";
    }
    if (!formData.apellidos.trim()) {
      nuevosErrores.apellidos = "Los apellidos son obligatorios.";
    }
    if (!formData.documentoIdentidad.trim()) {
      nuevosErrores.documentoIdentidad = "El documento de identidad es obligatorio.";
    }
    if (!formData.tarjetaProfesional.trim()) {
      nuevosErrores.tarjetaProfesional = "La tarjeta profesional es obligatoria.";
    }
    if (!formData.correoElectronico.trim()) {
      nuevosErrores.correoElectronico = "El correo electrónico es obligatorio.";
    } else if (!validarCorreo(formData.correoElectronico)) {
      nuevosErrores.correoElectronico = "Correo electrónico no válido.";
    }

    setErroresValidacion(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (erroresValidacion[name]) {
      setErroresValidacion((prev) => {
        const { [name]: _, ...resto } = prev;
        return resto;
      });
    }

    if (name === "correoElectronico" && value && !validarCorreo(value)) {
      setErroresValidacion((prev) => ({
        ...prev,
        correoElectronico: "Correo electrónico no válido.",
      }));
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setError(null);
    setExito(null);
    setCargando(true);

    try {
      await crearFisioterapeuta(formData);
      setExito(
        "Fisioterapeuta registrado exitosamente. Se han enviado las credenciales por correo electrónico."
      );
      setTimeout(() => navigate("/fisioterapeutas"), 2000);
    } catch (err) {
      console.error("Error al registrar fisioterapeuta:", err);
      setError(err.message || "Ocurrió un error al registrar el fisioterapeuta.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Registrar Nuevo Fisioterapeuta</h2>
          <p className="text-muted">
            Completa todos los campos obligatorios para registrar un nuevo profesional.
          </p>
          <p className="text-danger small">* Campos obligatorios</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {exito && <Alert variant="success">{exito}</Alert>}

      <Form onSubmit={manejarEnvio}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="nombres">
              <Form.Label>Nombres *</Form.Label>
              <Form.Control
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={manejarCambio}
                isInvalid={!!erroresValidacion.nombres}
                required
              />
              <Form.Control.Feedback type="invalid">
                {erroresValidacion.nombres}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="apellidos">
              <Form.Label>Apellidos *</Form.Label>
              <Form.Control
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={manejarCambio}
                isInvalid={!!erroresValidacion.apellidos}
                required
              />
              <Form.Control.Feedback type="invalid">
                {erroresValidacion.apellidos}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="documentoIdentidad">
              <Form.Label>Documento de Identidad *</Form.Label>
              <Form.Control
                type="text"
                name="documentoIdentidad"
                value={formData.documentoIdentidad}
                onChange={manejarCambio}
                isInvalid={!!erroresValidacion.documentoIdentidad}
                required
              />
              <Form.Control.Feedback type="invalid">
                {erroresValidacion.documentoIdentidad}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="tarjetaProfesional">
              <Form.Label>Tarjeta Profesional *</Form.Label>
              <Form.Control
                type="text"
                name="tarjetaProfesional"
                value={formData.tarjetaProfesional}
                onChange={manejarCambio}
                isInvalid={!!erroresValidacion.tarjetaProfesional}
                required
              />
              <Form.Control.Feedback type="invalid">
                {erroresValidacion.tarjetaProfesional}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="especialidades">
              <Form.Label>Especialidades</Form.Label>
              <Form.Control
                type="text"
                name="especialidades"
                value={formData.especialidades}
                onChange={manejarCambio}
                placeholder="Ej: rehabilitación, traumatología"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="telefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={manejarCambio}
                placeholder="Ej: 3001234567"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="correoElectronico">
              <Form.Label>Correo Electrónico *</Form.Label>
              <Form.Control
                type="email"
                name="correoElectronico"
                value={formData.correoElectronico}
                onChange={manejarCambio}
                isInvalid={!!erroresValidacion.correoElectronico}
                placeholder="ejemplo@correo.com"
                required
              />
              <Form.Control.Feedback type="invalid">
                {erroresValidacion.correoElectronico}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="horarioDisponibilidad">
              <Form.Label>Horario de Disponibilidad</Form.Label>
              <Form.Control
                type="text"
                name="horarioDisponibilidad"
                value={formData.horarioDisponibilidad}
                onChange={manejarCambio}
                placeholder="Ej: Lunes a Viernes 8:00 - 17:00"
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end mt-4">
          <Button
            variant="secondary"
            className="me-2"
            onClick={() => navigate("/fisioterapeutas")}
            disabled={cargando}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={cargando}>
            {cargando ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Registrando...
              </>
            ) : (
              "Registrar Profesional"
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
}
