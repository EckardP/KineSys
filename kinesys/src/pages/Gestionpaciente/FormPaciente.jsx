import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import {
  crearPaciente,
  actualizarPaciente,
  obtenerPaciente,
} from "../../services/pacientesService";

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
  useEffect(() => {
    if (esEdicion) {
      cargarPaciente();
    }
  }, [id]);

  const cargarPaciente = async () => {
    try {
      setCargando(true);
      const respuesta = await obtenerPaciente(id);
      setFormData({
        nombreCompleto: respuesta.data.nombreCompleto || "",
        documentoIdentidad: respuesta.data.documentoIdentidad || "",
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

  // --- Validaciones ---
  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar campos obligatorios
    if (!formData.nombreCompleto.trim()) nuevosErrores.nombreCompleto = "El nombre completo es obligatorio";
    if (!formData.documentoIdentidad.trim()) nuevosErrores.documentoIdentidad = "El documento de identidad es obligatorio";
    if (!formData.telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio";
    if (!formData.correoElectronico.trim()) nuevosErrores.correoElectronico = "El correo electrónico es obligatorio";
    if (!formData.fechaNacimiento) nuevosErrores.fechaNacimiento = "La fecha de nacimiento es obligatoria";
    if (!formData.genero) nuevosErrores.genero = "El género es obligatorio";
    if (!formData.direccion.trim()) nuevosErrores.direccion = "La dirección es obligatoria";

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.correoElectronico && !emailRegex.test(formData.correoElectronico)) {
      nuevosErrores.correoElectronico = "Formato de correo electrónico inválido";
    }

    // Validar teléfono (solo números, mínimo 8 dígitos)
    const telefonoRegex = /^\d{8,}$/;
    if (formData.telefono && !telefonoRegex.test(formData.telefono.replace(/\s/g, ''))) {
      nuevosErrores.telefono = "El teléfono debe contener solo números y al menos 8 dígitos";
    }

    // Validar documento de identidad (solo números)
    const documentoRegex = /^\d+$/;
    if (formData.documentoIdentidad && !documentoRegex.test(formData.documentoIdentidad)) {
      nuevosErrores.documentoIdentidad = "El documento debe contener solo números";
    }

    // Validar fecha de nacimiento (no puede ser fecha futura)
    if (formData.fechaNacimiento) {
      const fechaNacimiento = new Date(formData.fechaNacimiento);
      const hoy = new Date();
      if (fechaNacimiento > hoy) {
        nuevosErrores.fechaNacimiento = "La fecha de nacimiento no puede ser futura";
      }
    }

    setErroresValidacion(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // --- Manejar cambios en los campos ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (erroresValidacion[name]) {
      setErroresValidacion(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // --- Enviar formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario antes de enviar
    if (!validarFormulario()) {
      setError("Por favor, corrige los errores en el formulario.");
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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