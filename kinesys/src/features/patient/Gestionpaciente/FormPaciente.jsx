import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import {
  crearPaciente,
  actualizarPaciente,
  obtenerPaciente,
} from "@/services/pacientesService";

export default function FormPaciente() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = !!id;

  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    documentoIdentidad: "",
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
  const [erroresValidacion, setErroresValidacion] = useState({});

  //  Si es edición, obtener datos del paciente
  const cargarPaciente = useCallback(async () => {
    try {
      setCargando(true);
      const respuesta = await obtenerPaciente(id);
      setFormData({
        nombreCompleto: respuesta.nombreCompleto || "",
        documentoIdentidad: respuesta.documentoIdentidad || "",
        fechaNacimiento: respuesta.fechaNacimiento?.split("T")[0] || "",
        genero: respuesta.genero || "",
        telefono: respuesta.telefono || "",
        correoElectronico: respuesta.correoElectronico || "",
        direccion: respuesta.direccion || "",
        historialMedico: respuesta.historialMedico || "",
        idSeguroMedico: respuesta.idSeguroMedico || "",
      });
      setCargando(false);
    } catch (err) {
      console.error("Error al obtener paciente:", err);
      setError("No se pudieron cargar los datos del paciente.");
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    if (esEdicion) {
      cargarPaciente();
    }
  }, [cargarPaciente, esEdicion]);

  // Función para validar el correo electrónico
  const validarCorreo = (correo) => {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correo);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Eliminar error del campo al escribir (para todos los campos)
    if (erroresValidacion[name]) {
      setErroresValidacion((prev) => {
        const { [name]: _, ...resto } = prev;
        return resto;
      });
    }

    // Validar el correo electrónico en tiempo real
    if (name === "correoElectronico") {
      if (!validarCorreo(value)) {
        setErroresValidacion((prev) => ({ ...prev, correoElectronico: "Correo electrónico no válido." }));
      }
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombreCompleto.trim()) {
      nuevosErrores.nombreCompleto = "El nombre completo es obligatorio.";
    }

    if (!formData.documentoIdentidad.trim()) {
      nuevosErrores.documentoIdentidad = "El documento de identidad es obligatorio.";
    }

    if (!formData.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    }

    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio.";
    }

    if (!formData.correoElectronico.trim()) {
      nuevosErrores.correoElectronico = "El correo electrónico es obligatorio.";
    } else if (!validarCorreo(formData.correoElectronico)) {
      nuevosErrores.correoElectronico = "Correo electrónico no válido.";
    }

    setErroresValidacion(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    // Validar todos los campos obligatorios
    if (!validarFormulario()) {
      return;
    }

    console.log("Payload a enviar:", formData);
    setError(null);
    setExito(null);
    setCargando(true);

    const payload = {
      NombreCompleto: formData.nombreCompleto,
      DocumentoIdentidad: formData.documentoIdentidad,
      FechaNacimiento: formData.fechaNacimiento,
      Genero: formData.genero,
      Telefono: formData.telefono,
      CorreoElectronico: formData.correoElectronico,
      Direccion: formData.direccion,
      HistorialMedico: formData.historialMedico || "Sin historial",
      IdSeguroMedico: formData.idSeguroMedico ? parseInt(formData.idSeguroMedico) : null
    };

    try {
      if (esEdicion) {
        await actualizarPaciente(id, payload);
        setExito("Paciente actualizado correctamente.");
      } else {
        await crearPaciente(payload);
        setExito("Paciente registrado exitosamente.");
      }

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
              : "Completa todos los campos obligatorios para registrar un nuevo paciente."}
          </p>
          <p className="text-danger small">* Campos obligatorios</p>
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
        <Form onSubmit={manejarEnvio}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="nombreCompleto">
                <Form.Label>Nombre Completo *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={manejarCambio}
                  isInvalid={!!erroresValidacion.nombreCompleto}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {erroresValidacion.nombreCompleto}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
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

            <Col md={3}>
              <Form.Group controlId="fechaNacimiento">
                <Form.Label>Fecha de Nacimiento *</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={manejarCambio}
                  isInvalid={!!erroresValidacion.fechaNacimiento}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {erroresValidacion.fechaNacimiento}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
              <Form.Group controlId="genero">
                <Form.Label>Género *</Form.Label>
                <Form.Select
                   name="genero"
                   value={formData.genero}
                   onChange={manejarCambio}
                   isInvalid={!!erroresValidacion.genero}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                  <option value="Prefiero no decir">Prefiero no decir</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {erroresValidacion.genero}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group controlId="telefono">
                <Form.Label>Teléfono *</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={manejarCambio}
                  isInvalid={!!erroresValidacion.telefono}
                  placeholder="Ej: 12345678"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {erroresValidacion.telefono}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
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

            <Col md={3}>
              <Form.Group controlId="idSeguroMedico">
                <Form.Label>ID Seguro Médico</Form.Label>
                <Form.Control
                  type="number"
                  name="idSeguroMedico"
                  value={formData.idSeguroMedico}
                  onChange={manejarCambio}
                  min="0"
                  placeholder="Opcional"
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
                  onChange={manejarCambio}
                  isInvalid={!!erroresValidacion.direccion}
                  placeholder="Dirección completa"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {erroresValidacion.direccion}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="historialMedico">
                <Form.Label>Historial Médico</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="historialMedico"
                  value={formData.historialMedico}
                  onChange={manejarCambio}
                  placeholder="Información médica relevante (opcional)"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-4">
            <Button
              variant="secondary"
              className="me-2"
              onClick={() => navigate("/pacientes")}
              disabled={cargando}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={cargando}>
              {cargando ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {esEdicion ? "Guardando..." : "Registrando..."}
                </>
              ) : (
                esEdicion ? "Guardar Cambios" : "Registrar Paciente"
              )}
            </Button>
          </div>
        </Form>
      )}
    </Container>
  );
}
