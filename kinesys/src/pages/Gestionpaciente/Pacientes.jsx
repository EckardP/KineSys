import React, { useEffect, useState } from "react";
import { Button, Table, Form, Row, Col, Badge, Container, Spinner, Alert, Modal, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  listarPacientes,
  eliminarPaciente,
  crearPaciente
} from "../../services/pacientesService";

export default function Pacientes() {
  // Estados principales
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Estado del formulario de registro
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    documentoIdentidad: '',
    telefono: '',
    correoElectronico: '',
    fechaNacimiento: '',
    genero: '',
    direccion: '',
    historialMedico: '',
    idSeguroMedico: 0
  });

  // ✅ Cargar pacientes al montar el componente
  useEffect(() => {
    cargarPacientes();
  }, []);

  // --- Función para obtener pacientes desde el backend ---
  const cargarPacientes = async () => {
    try {
      setCargando(true);
      const respuesta = await listarPacientes();
      setPacientes(respuesta.data || respuesta);
      setCargando(false);
    } catch (err) {
      console.error("Error al listar pacientes:", err);
      setError("No se pudo obtener la lista de pacientes.");
      setCargando(false);
    }
  };

  // --- Función para eliminar un paciente ---
  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este paciente?");
    if (!confirmar) return;

    try {
      await eliminarPaciente(id);
      setPacientes((prev) => prev.filter((p) => p.id !== id));
      setError(null);
    } catch (err) {
      console.error("Error al eliminar paciente:", err);
      setError("No se pudo eliminar el paciente.");
    }
  };

  // --- Manejo del formulario de registro ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'idSeguroMedico' ? parseInt(value) || 0 : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      await crearPaciente(formData);
      await cargarPacientes(); // Recargar la lista
      setShowModal(false);
      resetForm();
      setError(null);
      alert('Paciente registrado correctamente');
    } catch (error) {
      console.error('Error al registrar paciente:', error);
      setError('Ocurrió un error al registrar el paciente');
    } finally {
      setEnviando(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombreCompleto: '',
      documentoIdentidad: '',
      telefono: '',
      correoElectronico: '',
      fechaNacimiento: '',
      genero: '',
      direccion: '',
      historialMedico: '',
      idSeguroMedico: 0
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // --- Filtrado de pacientes ---
  const pacientesFiltrados = pacientes ? pacientes.filter(
    (p) =>
      p.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.correoElectronico?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.telefono?.includes(busqueda) ||
      p.documentoIdentidad?.includes(busqueda)
  ) : [];

  return (
    <Container className="mt-4">
      {/* Encabezado */}
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="fw-bold text-dark">Gestión de Pacientes</h2>
          <p className="text-muted">
            Consulta, registra o elimina pacientes del sistema.
          </p>
        </Col>
        <Col className="text-end">
          <Button 
            variant="success"
            className="me-2"
            onClick={() => setShowModal(true)}
          >
            + Nuevo Paciente
          </Button>
          <Button 
            variant="outline-primary" 
            onClick={cargarPacientes}
            disabled={cargando}
          >
            {cargando ? <Spinner animation="border" size="sm" /> : "Actualizar"}
          </Button>
        </Col>
      </Row>

      {/* Campo de búsqueda */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre, documento, correo o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </Col>
        <Col md={6} className="text-end">
          <Badge bg="primary" className="fs-6">
            Total: {pacientesFiltrados.length} paciente(s)
          </Badge>
        </Col>
      </Row>

      {/* Estado de carga */}
      {cargando && (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Cargando pacientes...</p>
        </div>
      )}

      {/* Estado de error */}
      {error && (
        <Alert variant="danger" className="text-center" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tabla de pacientes */}
      {!cargando && !error && (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>Nombre Completo</th>
                <th>Documento</th>
                <th>Fecha Nacimiento</th>
                <th>Género</th>
                <th>Teléfono</th>
                <th>Correo Electrónico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientesFiltrados.length > 0 ? (
                pacientesFiltrados.map((p) => (
                  <tr key={p.id}>
                    <td className="fw-bold">{p.nombreCompleto}</td>
                    <td>
                      <Badge bg="secondary">{p.documentoIdentidad || "—"}</Badge>
                    </td>
                    <td>
                      {p.fechaNacimiento
                        ? new Date(p.fechaNacimiento).toLocaleDateString('es-ES')
                        : "—"}
                    </td>
                    <td>
                      <Badge 
                        bg={
                          p.genero === "masculino" ? "primary" : 
                          p.genero === "femenino" ? "success" : "warning"
                        }
                      >
                        {p.genero || "—"}
                      </Badge>
                    </td>
                    <td>{p.telefono || "—"}</td>
                    <td>
                      {p.correoElectronico ? (
                        <a href={`mailto:${p.correoElectronico}`} className="text-decoration-none">
                          {p.correoElectronico}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-1">
                        <Button
                          as={Link}
                          to={`/pacientes/${p.id}`}
                          variant="outline-primary"
                          size="sm"
                        >
                          Ver
                        </Button>
                        <Button
                          as={Link}
                          to={`/pacientes/editar/${p.id}`}
                          variant="outline-warning"
                          size="sm"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleEliminar(p.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    {busqueda ? "No se encontraron pacientes con esos criterios." : "No hay pacientes registrados."}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal para registrar nuevo paciente */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="bg-secondary text-white">
          <Modal.Title>Registro de Paciente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Información Personal */}
            <h5 className="mb-3">Información Personal</h5>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label className="fw-bold">
                  Nombre Completo <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nombreCompleto"
                  placeholder="Ingrese el nombre completo"
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-bold">
                  Documento de Identidad <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="documentoIdentidad"
                  placeholder="Ingrese el documento de identidad"
                  value={formData.documentoIdentidad}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label className="fw-bold">
                  Teléfono <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="telefono"
                  placeholder="Ingrese el número de teléfono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-bold">
                  Correo Electrónico
                </Form.Label>
                <Form.Control
                  type="email"
                  name="correoElectronico"
                  placeholder="Ingrese el correo electrónico"
                  value={formData.correoElectronico}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label className="fw-bold">
                  Fecha de Nacimiento <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-bold">
                  Género <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione el género</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                  <option value="prefiero-no-decir">Prefiero no decir</option>
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label className="fw-bold">
                  Dirección
                </Form.Label>
                <Form.Control
                  type="text"
                  name="direccion"
                  placeholder="Ingrese la dirección completa"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <hr className="my-3" />

            {/* Información Médica */}
            <h5 className="mb-3">Información Médica</h5>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label className="fw-bold">
                  ID Seguro Médico
                </Form.Label>
                <Form.Control
                  type="number"
                  name="idSeguroMedico"
                  placeholder="Ingrese el ID del seguro médico"
                  value={formData.idSeguroMedico}
                  onChange={handleChange}
                  min="0"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label className="fw-bold">
                  Historial Médico
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="historialMedico"
                  placeholder="Ingrese el historial médico del paciente"
                  value={formData.historialMedico}
                  onChange={handleChange}
                />
                <Form.Text className="text-muted">
                  Incluya información relevante sobre condiciones médicas, alergias, medicamentos, etc.
                </Form.Text>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button 
                variant="outline-secondary" 
                onClick={handleCloseModal}
                disabled={enviando}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={enviando}
              >
                {enviando ? <Spinner animation="border" size="sm" /> : "Registrar Paciente"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}