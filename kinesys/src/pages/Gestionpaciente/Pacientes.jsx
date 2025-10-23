import React, { useEffect, useState } from "react";
import { Button, Table, Form, Row, Col, Badge, Container, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  listarPacientes,
  eliminarPacientes,
} from "../../services/pacientesService"; // ✅ importa tus funciones CRUD

export default function Pacientes() {
  // Estados principales
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Cargar pacientes al montar el componente
  useEffect(() => {
    cargarPacientes();
  }, []);

  // --- Función para obtener pacientes desde el backend ---
  const cargarPacientes = async () => {
    try {
      setCargando(true);
      const respuesta = await listarPacientes(); // ← llama a tu servicio
      setPacientes(respuesta.data); // asume que backend responde con { data: [...] }
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
      await eliminarPacientes(id);
      setPacientes((prev) => prev.filter((p) => p.id !== id)); // actualiza el estado local
      alert("Paciente eliminado correctamente.");
    } catch (err) {
      console.error("Error al eliminar paciente:", err);
      alert("No se pudo eliminar el paciente.");
    }
  };

  // --- Filtrado de pacientes ---
  const pacientesFiltrados = pacientes ? pacientes.filter(
    (p) =>
      p.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.correoElectronico?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.telefono?.includes(busqueda)
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
          <Button as={Link} to="/pacientes/nuevo" variant="success">
            + Nuevo Paciente
          </Button>
        </Col>
      </Row>

      {/* Campo de búsqueda */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre, correo o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
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
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {/* Tabla de pacientes */}
      {!cargando && !error && (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Nombre Completo</th>
              <th>Fecha Nacimiento</th>
              <th>Género</th>
              <th>Teléfono</th>
              <th>Correo Electrónico</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientesFiltrados.length > 0 ? (
              pacientesFiltrados.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombreCompleto}</td>
                  <td>
                    {p.fechaNacimiento
                      ? new Date(p.fechaNacimiento).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>{p.genero || "—"}</td>
                  <td>{p.telefono || "—"}</td>
                  <td>{p.correoElectronico || "—"}</td>
                  <td>{p.direccion || "—"}</td>
                  <td className="text-center">
                    <Button
                      as={Link}
                      to={`/pacientes/${p.id}`}
                      variant="primary"
                      size="sm"
                      className="me-2"
                    >
                      Ver
                    </Button>
                    <Button
                      as={Link}
                      to={`/pacientes/editar/${p.id}`}
                      variant="warning"
                      size="sm"
                      className="me-2"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleEliminar(p.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">
                  No hay pacientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
