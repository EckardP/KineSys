// src/pages/GestionAdmin/GestionAgenda/AgendaAdmin.jsx
import React, { useEffect, useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { listarCitas } from '../../../services/citasService';
import { listarTerapeutas } from '../../../services/terapeutasService';
import { listarPacientes } from '../../../services/pacientesService';
import { Spinner, Alert, Form } from 'react-bootstrap';
import { Calendar as CalendarIcon, User } from 'lucide-react';

const AgendaAdmin = () => {
  const [citas, setCitas] = useState([]);
  const [terapeutas, setTerapeutas] = useState([]);
  const [pacientes, setPacientes] = useState([]); // ✅ ahora dentro del componente
  const [filtroTerapeuta, setFiltroTerapeuta] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        setLoading(true);
        const [citasRes, terapeutasRes, pacientesRes] = await Promise.all([
          listarCitas(),
          listarTerapeutas(),
          listarPacientes()
        ]);
        setCitas(citasRes || []);
        setTerapeutas(terapeutasRes || []);
        setPacientes(pacientesRes || []);
      } catch (err) {
        setError('Error al cargar la agenda');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    cargarDatos();
  }, []);

  const eventos = useMemo(() => {
    let filtradas = citas;
    if (filtroTerapeuta !== 'todos') {
      filtradas = citas.filter(c => c.idTerapeuta === Number(filtroTerapeuta));
    }

    return filtradas.map(cita => {
      const terapeuta = terapeutas.find(t => t.id === cita.idTerapeuta);
      const paciente = pacientes.find(p => p.id === cita.idPaciente); // ✅ busca el paciente por ID

      const colorMap = {
        programada: '#3b82f6',
        completada: '#10b981',
        cancelada: '#ef4444',
        inasistencia: '#f59e0b',
      };

      return {
        id: cita.idCita, // ✅ campo correcto
        title: `${paciente?.nombres || 'Paciente'} - ${terapeuta?.nombres || 'Terapeuta'}`,
        start: cita.horaInicioReal, // ✅ propiedad del backend
        end: cita.horaFinReal,      // ✅ propiedad del backend
        backgroundColor: colorMap[cita.estado] || '#6b7280',
        borderColor: colorMap[cita.estado] || '#6b7280',
        textColor: 'white',
        extendedProps: { estado: cita.estado, paciente, terapeuta },
      };
    });
  }, [citas, terapeutas, pacientes, filtroTerapeuta]);

  const handleEventClick = (info) => {
    const { paciente, terapeuta, estado } = info.event.extendedProps;
    const fecha = new Date(info.event.start).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    alert(
      `Cita #${info.event.id}\n` +
      `Paciente: ${paciente?.nombres || 'N/A'}\n` +
      `Terapeuta: ${terapeuta?.nombres || 'N/A'}\n` +
      `Fecha: ${fecha}\n` +
      `Estado: ${estado}`
    );
  };

  if (loading) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner animation="border" />
        <span className="ml-3">Cargando agenda...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100" style={{ minWidth: "200vh" }}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <CalendarIcon size={32} /> Agenda General
        </h1>
        <p className="text-gray-600">Todas las citas de los terapeutas</p>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center gap-2">
          <User size={20} className="text-gray-500" />
          <Form.Select
            value={filtroTerapeuta}
            onChange={e => setFiltroTerapeuta(e.target.value)}
            className="w-full md:w-64"
          >
            <option value="todos">Todos los terapeutas</option>
            {terapeutas.map(t => (
              <option key={t.id} value={t.id}>{t.nombres}</option>
            ))}
          </Form.Select>
        </div>

        <div className="flex gap-3 text-sm">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div> Programada
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div> Completada
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div> Cancelada
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={eventos}
          eventClick={handleEventClick}
          height="700px"
          slotMinTime="06:00:00"
          slotMaxTime="20:00:00"
          locale="es"
          buttonText={{
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
          }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }}
        />
      </div>
    </div>
  );
};

export default AgendaAdmin;
