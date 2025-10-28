// src/pages/GestionAdmin/Reportes.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, Users, Stethoscope, TrendingUp, Activity, FileText, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { listarPacientes } from '../../../services/pacientesService.js';
import { listarTerapeutas } from '../../../services/terapeutasService.js';
import { listarCitas } from '../../../services/citasService.js';
import '../../AdminHome/AdminDashBoard.css';

const Reportes = () => {
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [terapeutas, setTerapeutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periodo, setPeriodo] = useState('mes'); // semana, mes, trimestre, año

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [citasData, pacientesData, terapeutasData] = await Promise.all([
          listarCitas(),
          listarPacientes(),
          listarTerapeutas(),
        ]);
        setCitas(citasData);
        setPacientes(pacientesData);
        setTerapeutas(terapeutasData);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Calcular estadísticas
  const totalPacientes = pacientes.length;
  const pacientesActivos = pacientes.filter(p => p.estado === 'activo').length;
  const totalTerapeutas = terapeutas.length;
  const terapeutasActivos = terapeutas.filter(t => t.estado === 'activo').length;
  const totalCitas = citas.length;
  const citasCompletadas = citas.filter(c => c.estado === 'completada').length;
  const citasProgramadas = citas.filter(c => c.estado === 'programada').length;
  const citasCanceladas = citas.filter(c => c.estado === 'cancelada' || c.estado === 'inasistencia').length;

  // Distribución de estados de citas
  const estadoCitasData = [
    { name: 'Completadas', value: citasCompletadas, color: '#10b981' },
    { name: 'Programadas', value: citasProgramadas, color: '#3b82f6' },
    { name: 'Canceladas', value: citasCanceladas, color: '#ef4444' },
  ];

  // Citas por terapeuta
  const citasPorTerapeuta = terapeutas.map(terapeuta => ({
    nombre: terapeuta.nombres.split(' ')[0],
    citas: citas.filter(c => c.idTerapeuta === terapeuta.id).length,
    completadas: citas.filter(c => c.idTerapeuta === terapeuta.id && c.estado === 'completada').length,
  }));

  // Tendencia mensual de citas (últimos 6 meses)
  const getMonthlyData = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentMonth = new Date().getMonth();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[monthIndex];
      const citasDelMes = citas.filter(c => {
        const citaMonth = new Date(c.fecha).getMonth();
        return citaMonth === monthIndex;
      });

      data.push({
        mes: monthName,
        total: citasDelMes.length,
        completadas: citasDelMes.filter(c => c.estado === 'completada').length,
        canceladas: citasDelMes.filter(c => c.estado === 'cancelada' || c.estado === 'inasistencia').length,
      });
    }

    return data;
  };

  const monthlyData = getMonthlyData();

  // Distribución por género
  const generoData = [
    { name: 'Masculino', value: pacientes.filter(p => p.genero === 'M').length, color: '#3b82f6' },
    { name: 'Femenino', value: pacientes.filter(p => p.genero === 'F').length, color: '#ec4899' },
    { name: 'Otro', value: pacientes.filter(p => p.genero === 'Otro').length, color: '#8b5cf6' },
  ];

  const tasaCompletitud = totalCitas > 0 ? ((citasCompletadas / totalCitas) * 100).toFixed(1) : '0';
  const tasaCancelacion = totalCitas > 0 ? ((citasCanceladas / totalCitas) * 100).toFixed(1) : '0';

  // Exportar a Excel
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      citas.map(c => ({
        Paciente: c.paciente?.nombreCompleto || 'N/A',
        Terapeuta: c.terapeuta?.nombres || 'N/A',
        Fecha: new Date(c.fecha).toLocaleDateString(),
        Estado: c.estado,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reportes');
    XLSX.writeFile(workbook, 'reportes_clinica.xlsx');
  };

  if (loading) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Spinner animation="border" />
          <p className="text-muted mt-2">Cargando reportes...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <div className="dashboard-container">
      <Container className="dashboard-content">
        {/* Header */}
        <Row className="mb-4 align-items-center">
          <Col>
            <h1 className="dashboard-title">Reportes y Estadísticas</h1>
            <p className="text-muted">Análisis y métricas de la clínica</p>
          </Col>
          <Col className="d-flex justify-content-end gap-2">
            <Form.Select
              value={periodo}
              onChange={e => setPeriodo(e.target.value)}
              style={{ maxWidth: '180px' }}
            >
              <option value="semana">Última semana</option>
              <option value="mes">Último mes</option>
              <option value="trimestre">Último trimestre</option>
              <option value="año">Último año</option>
            </Form.Select>
            <Button variant="outline-primary" className="d-flex align-items-center gap-2" onClick={handleExport}>
              <Download size={16} />
              Exportar
            </Button>
          </Col>
        </Row>

        {/* Métricas Clave */}
        <Row className="metrics-section mb-4">
          <Col md={3}>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title className="text-muted">Total Pacientes</Card.Title>
                  <Users size={20} className="text-muted" />
                </div>
                <h3>{totalPacientes}</h3>
                <Card.Text className="text-muted">{pacientesActivos} activos</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title className="text-muted">Terapeutas</Card.Title>
                  <Stethoscope size={20} className="text-muted" />
                </div>
                <h3>{totalTerapeutas}</h3>
                <Card.Text className="text-muted">{terapeutasActivos} activos</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title className="text-muted">Total Citas</Card.Title>
                  <Calendar size={20} className="text-muted" />
                </div>
                <h3>{totalCitas}</h3>
                <Card.Text className="text-muted">{citasProgramadas} programadas</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title className="text-muted">Tasa Completitud</Card.Title>
                  <TrendingUp size={20} className="text-muted" />
                </div>
                <h3>{tasaCompletitud}%</h3>
                <Card.Text className="text-muted">{citasCompletadas} completadas</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Sección de Gráficos */}
        <Row className="mb-4">
          <Col lg={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Tendencia de Citas (Últimos 6 Meses)</Card.Title>
                <Card.Text className="text-muted">Evolución mensual de citas completadas y canceladas</Card.Text>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#3b82f6" name="Total" strokeWidth={2} />
                    <Line type="monotone" dataKey="completadas" stroke="#10b981" name="Completadas" strokeWidth={2} />
                    <Line type="monotone" dataKey="canceladas" stroke="#ef4444" name="Canceladas" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Distribución de Estados de Citas</Card.Title>
                <Card.Text className="text-muted">Proporción de citas por estado</Card.Text>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={estadoCitasData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {estadoCitasData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Citas por Terapeuta</Card.Title>
                <Card.Text className="text-muted">Distribución de carga de trabajo</Card.Text>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={citasPorTerapeuta}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="citas" fill="#3b82f6" name="Total Citas" />
                    <Bar dataKey="completadas" fill="#10b981" name="Completadas" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Distribución por Género</Card.Title>
                <Card.Text className="text-muted">Composición de pacientes por género</Card.Text>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={generoData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {generoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Estadísticas Adicionales */}
        <Row>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title className="d-flex align-items-center gap-2">
                  <Activity size={20} /> Rendimiento General
                </Card.Title>
                <div className="d-flex justify-content-between mt-3">
                  <span className="text-muted">Tasa de Completitud</span>
                  <span>{tasaCompletitud}%</span>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span className="text-muted">Tasa de Cancelación</span>
                  <span>{tasaCancelacion}%</span>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span className="text-muted">Promedio Citas/Terapeuta</span>
                  <span>{totalTerapeutas > 0 ? (totalCitas / totalTerapeutas).toFixed(1) : '0'}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title className="d-flex align-items-center gap-2">
                  <Users size={20} /> Estadísticas de Pacientes
                </Card.Title>
                <div className="d-flex justify-content-between mt-3">
                  <span className="text-muted">Pacientes Activos</span>
                  <span>{pacientesActivos}</span>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span className="text-muted">Pacientes Inactivos</span>
                  <span>{totalPacientes - pacientesActivos}</span>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span className="text-muted">Nuevos este mes</span>
                  <span>
                    {
                      pacientes.filter(p => {
                        if (!p.fechaRegistro) return false;
                        const registro = new Date(p.fechaRegistro);
                        const hoy = new Date();
                        return registro.getMonth() === hoy.getMonth() && registro.getFullYear() === hoy.getFullYear();
                      }).length
                    }
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title className="d-flex align-items-center gap-2">
                  <FileText size={20} /> Resumen de Citas
                </Card.Title>
                <div className="d-flex justify-content-between mt-3">
                  <span className="text-muted">Completadas</span>
                  <span className="text-success">{citasCompletadas}</span>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span className="text-muted">Programadas</span>
                  <span className="text-primary">{citasProgramadas}</span>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span className="text-muted">Canceladas</span>
                  <span className="text-danger">{citasCanceladas}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Reportes;