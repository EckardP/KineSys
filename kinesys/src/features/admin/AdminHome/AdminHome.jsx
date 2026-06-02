// src/features/admin/AdminHome.jsx

import {
  BarChart3,
  Building2,
  CalendarCheck2,
  CalendarDays,
  ClipboardList,
  FileBarChart,
  Package,
  Stethoscope,
  UserPlus,
  Users,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import MetricCard from "../GestionAdmin/components/Cartas/MetricCard"
import QuickAccessButton from "../GestionAdmin/components/Botones/QuickAccessButton"
import { listarTerapeutas } from "@/services/terapeutasService.js"
import { listarCitas } from "@/services/citasService.js"
import "./AdminDashboard.css"
import { Routes, Route, Navigate } from "react-router-dom"
import AgendaAdmin from "../GestionAdmin/GestionAgenda/AgendaAdmin"
import PatientList from "../GestionAdmin/GestionPaciente/PatientList"
import Reportes from "../GestionAdmin/GestionReporte/Reportes"
import TerapeutaForm from "../GestionAdmin/GestionTerapeuta/TerapeutaForm"
import TratamientosList from "../GestionAdmin/GestionTratamiento/TratamientosList"
import { createConnection, startConnection, stopConnection } from "@/services/SignalRService"
import { useAuth } from "@/hooks/useAuth"
import { setAuthToken } from "@/api/apiCliente"

import EquiposList from "../GestionAdmin/GestionEquipo/EquiposList"
import TipoServiciosList from "../GestionAdmin/GestionServicio/TipoServiciosList"
import SalasList from "../GestionAdmin/GestionSala/SalasList"
import CitaList from "../GestionAdmin/GestionCita/CitaList"

function AdminDashboard() {
  const [totalTerapeutas, setTotalTerapeutas] = useState(0)
  const [sesionesDia, setSesionesDia] = useState(0)
  const [ocupacionAgenda, setOcupacionAgenda] = useState(0)
  const [notificaciones, setNotificaciones] = useState([])
  const [datosCargados, setDatosCargados] = useState(false)

  const connectionRef = useRef(null)
  const welcomedRef = useRef(false)
  const { usuario, token, logout, isAuthenticated, loading } = useAuth() // Agregar loading

  // SINCRONIZAR TOKEN CON APICLIENTE
  useEffect(() => {
    if (token) {
      setAuthToken(token);
      console.log("✅ Token sincronizado con apiCliente desde el contexto");
    }
  }, [token]);

  // LIMPIAR NOTIFICACIONES ANTIGUAS AL INICIAR
  useEffect(() => {
    // Limpiar notificaciones previas al montar el componente
    setNotificaciones([]);
  }, []);

  // MANEJAR EXPIRACIÓN DE TOKEN
  useEffect(() => {
    const handleTokenExpired = () => {
      console.log("🔐 Token expirado - Cerrando sesión");
      setNotificaciones(prev => [
        {
          tipo: "error",
          texto: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
          fecha: new Date(),
        },
        ...prev,
      ]);
      
      setTimeout(() => {
        if (logout) {
          logout();
        } else {
          window.location.href = '/login';
        }
      }, 2000);
    };

    window.addEventListener('auth-token-expired', handleTokenExpired);
    
    return () => {
      window.removeEventListener('auth-token-expired', handleTokenExpired);
    };
  }, [logout]);

  // Determinar displayName y userId de forma robusta
  const displayName = usuario?.nombre
    || usuario?.nombreCompleto
    || usuario?.nombres
    || usuario?.usuario
    || usuario?.email
    || "Usuario"

  const userIdForSignalR = usuario?.id || usuario?.usuario || usuario?.email || null

  // CONEXIÓN SIGNALR - Solo cuando esté autenticado
  useEffect(() => {
    if (loading) {
      console.log("[v0] AdminHome - Auth aún cargando, esperando...");
      return;
    }

    if (!isAuthenticated || !usuario || !userIdForSignalR) {
      console.log("[v0] AdminHome - No autenticado o usuario no disponible");
      return;
    }

    // Si ya existe una conexión activa, reutilizar
    if (connectionRef.current && connectionRef.current.state !== undefined && connectionRef.current.state !== 0) {
      console.log("[v0] AdminHome - Conexión ya existente, reutilizando");
      return;
    }

    // Crear y arrancar la conexión
    const setupConnection = async () => {
      try {
        console.log("[v0] AdminHome - Iniciando conexión SignalR... userId:", userIdForSignalR);
        const conn = createConnection(userIdForSignalR);
        connectionRef.current = conn;

        const connected = await startConnection(conn);
        if (!connected) {
          console.error("[v0] AdminHome - No se pudo conectar a SignalR");
          return;
        }

        console.log("[v0] AdminHome - SignalR conectado exitosamente");

        // Bienvenida (solo la primera vez)
        if (!welcomedRef.current) {
          setNotificaciones(prev => [
            {
              tipo: "info",
              texto: `¡Bienvenido ${displayName}! Estás conectado a las notificaciones en tiempo real.`,
              fecha: new Date(),
            },
            ...prev,
          ]);
          welcomedRef.current = true;
        }

        // Limpieza previa de handlers para evitar duplicados
        conn.off("Notificacion");
        conn.off("CitaAsignada");
        conn.off("Error");

        conn.on("Notificacion", (mensaje) => {
          console.log("[v0] AdminHome - Notificación recibida:", mensaje);
          setNotificaciones(prev => {
            const nueva = [{ tipo: "info", texto: mensaje, fecha: new Date() }, ...prev];
            return nueva.slice(0, 50);
          });
        });

        conn.on("CitaAsignada", (cita) => {
          console.log("[v0] AdminHome - Cita asignada:", cita);
          setNotificaciones(prev => {
            const nueva = [{ tipo: "cita", texto: `Nueva cita asignada: ${cita}`, fecha: new Date() }, ...prev];
            return nueva.slice(0, 50);
          });
        });

        conn.on("Error", (error) => {
          console.error("[v0] AdminHome - Error recibido:", error);
          setNotificaciones(prev => {
            const nueva = [{ tipo: "error", texto: String(error), fecha: new Date() }, ...prev];
            return nueva.slice(0, 50);
          });
        });

        conn.onclose(() => {
          console.log("[v0] AdminHome - Conexión SignalR cerrada");
        });
      } catch (err) {
        console.error("[v0] AdminHome - Error en setupConnection:", err);
      }
    };

    setupConnection();

    return () => {
      const conn = connectionRef.current;
      if (conn) {
        conn.off("Notificacion");
        conn.off("CitaAsignada");
        conn.off("Error");
        stopConnection(conn);
      }
    };
  }, [displayName, isAuthenticated, loading, usuario, userIdForSignalR]);

  // Limpieza automática de notificaciones antiguas
  useEffect(() => {
    const CLEAN_INTERVAL_MS = 5000;
    const MAX_AGE_MS = 60 * 1000;

    const interval = setInterval(() => {
      setNotificaciones(prev => prev.filter(n => {
        const fecha = n.fecha instanceof Date ? n.fecha : new Date(n.fecha);
        return (Date.now() - fecha.getTime()) < MAX_AGE_MS;
      }));
    }, CLEAN_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  // CARGA DE DATOS - Solo cuando esté autenticado y no loading
  useEffect(() => {
    async function cargarDatos() {
      // Esperar a que la autenticación termine de cargar
      if (loading) {
        console.log("⏳ Auth aún cargando, esperando...");
        return;
      }

      // Si no está autenticado, no intentar cargar datos
      if (!isAuthenticated || !token) {
        console.log("🔐 No autenticado, omitiendo carga de datos");
        return;
      }

      // Evitar cargar datos múltiples veces
      if (datosCargados) {
        console.log("📊 Datos ya cargados, omitiendo...");
        return;
      }

      try {
        console.log("🔄 Cargando datos del dashboard...");
        
        const [terapeutas, citas] = await Promise.all([
          listarTerapeutas().catch(error => {
            console.error("❌ Error al cargar terapeutas:", error);
            if (error.message.includes('401')) {
              window.dispatchEvent(new Event('auth-token-expired'));
            }
            return [];
          }),
          listarCitas().catch(error => {
            console.error("❌ Error al cargar citas:", error);
            if (error.message.includes('401')) {
              window.dispatchEvent(new Event('auth-token-expired'));
            }
            return [];
          })
        ]);

        setTotalTerapeutas(terapeutas?.length ?? 0);

        const hoy = new Date().toDateString();
        const sesionesHoy = (citas || []).filter((cita) => {
          const fechaCita = cita.horaInicioReal ? new Date(cita.horaInicioReal).toDateString() : null;
          return fechaCita === hoy && cita.estado === "confirmada";
        }).length;
        setSesionesDia(sesionesHoy);

        const slotsDisponiblesTotales = (terapeutas?.length ?? 0) * 8;
        const ocupacion = slotsDisponiblesTotales > 0 ? Math.round((sesionesHoy / slotsDisponiblesTotales) * 100) : 0;
        setOcupacionAgenda(ocupacion);
        
        setDatosCargados(true);
        console.log("✅ Datos del dashboard cargados exitosamente");
        
      } catch (error) {
        console.error("❌ Error general al cargar datos del Dashboard:", error);
      }
    }

    cargarDatos();
  }, [isAuthenticated, token, loading, datosCargados]);

  // Mostrar loading mientras se inicializa la autenticación
  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-content">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Cargando...</div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar mensaje si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-content">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">No autenticado. Por favor, inicie sesión.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-header">
          <div>
            <span className="admin-dashboard-eyebrow">Administracion</span>
            <h1 className="admin-dashboard-title">Panel del administrador</h1>
          </div>
          <p className="admin-dashboard-intro">
            Supervisa la agenda, el equipo clinico y los recursos principales desde un espacio
            unico y facil de escanear.
          </p>
        </div>

        {notificaciones.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Notificaciones recientes</h4>
            <ul className="space-y-2">
              {notificaciones.slice(0, 5).map((notif, index) => (
                <li key={index} className="text-sm text-blue-800 flex items-start">
                  <span className="mr-2">{notif.tipo === "cita" ? "📅" : notif.tipo === "error" ? "⚠️" : "🔔"}</span>
                  <span>{notif.texto}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="admin-metrics-section">
          <MetricCard title="Terapeutas Activos" value={totalTerapeutas} icon={<Users size={24} />} />
          <MetricCard title="Sesiones del Dia" value={sesionesDia} icon={<CalendarDays size={24} />} />
          <MetricCard title="Ocupacion de Agenda" value={`${ocupacionAgenda}%`} icon={<BarChart3 size={24} />} />
        </div>

        <div className="admin-quick-access-section">
          <div className="admin-section-title-row">
            <CalendarCheck2 size={20} />
            <h2 className="admin-section-title">Atencion y agenda</h2>
          </div>
          <div className="admin-quick-access-buttons">
            <QuickAccessButton
              label="Gestionar Citas"
              path="/gestioncita/citas"
              icon={<CalendarCheck2 size={20} />}
            />
            <QuickAccessButton
              label="Gestionar Pacientes"
              path="/gestionpaciente/pacientes"
              icon={<UserPlus size={20} />}
            />
            <QuickAccessButton
              label="Gestionar Terapeutas"
              path="/gestionterapeuta/terapeuta"
              icon={<Users size={20} />}
            />
            <QuickAccessButton
              label="Ver Agenda"
              path="/gestionagenda/agendaadmin"
              icon={<CalendarDays size={20} />}
            />
          </div>
        </div>

        <div className="admin-quick-access-section">
          <div className="admin-section-title-row">
            <Stethoscope size={20} />
            <h2 className="admin-section-title">Operacion clinica</h2>
          </div>
          <div className="admin-quick-access-buttons">
            <QuickAccessButton
              label="Tratamientos"
              path="/gestiontratamiento/tratamientos"
              icon={<Stethoscope size={20} />}
            />
            <QuickAccessButton label="Equipos" path="/gestionequipo/equipos" icon={<Package size={20} />} />
            <QuickAccessButton label="Servicios" path="/gestionservicio/servicios" icon={<ClipboardList size={20} />} />
            <QuickAccessButton label="Salas" path="/gestionsala/salas" icon={<Building2 size={20} />} />
          </div>
        </div>

        <div className="admin-quick-access-section">
          <div className="admin-section-title-row">
            <FileBarChart size={20} />
            <h2 className="admin-section-title">Analisis</h2>
          </div>
          <div className="admin-quick-access-buttons admin-quick-access-buttons--compact">
            <QuickAccessButton
              label="Ver Reportes"
              path="/gestionreporte/reportes"
              icon={<FileBarChart size={20} />}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ... (el resto del código permanece igual)
export default function AdminHome() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />

      <Route path="/gestioncita/citas" element={<CitaList />} />

      <Route path="/gestionterapeuta/terapeuta" element={<TerapeutaForm />} />
      <Route path="/gestionagenda/agendaadmin" element={<AgendaAdmin />} />
      
      <Route path="/gestionpaciente/pacientes" element={<PatientList />} />
      <Route path="/gestionreporte/reportes" element={<Reportes />} />

      <Route path="/gestiontratamiento/tratamientos" element={<TratamientosList />} />
      <Route path="/gestionequipo/equipos" element={<EquiposList />} />
      {/* Nueva ruta para Gestión de Tipo de Servicios */}
      <Route path="/gestionservicio/servicios" element={<TipoServiciosList />} />

      <Route path="/gestionsala/salas" element={<SalasList />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
