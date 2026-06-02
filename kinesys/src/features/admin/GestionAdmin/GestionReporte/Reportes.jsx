// src/features/admin/GestionAdmin/GestionReporte/Reportes.jsx
import { useEffect, useState } from "react"
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
} from "recharts"
import { Calendar, Users, Stethoscope, TrendingUp, Activity, FileText, Download } from "lucide-react"
import { listarPacientes } from "@/services/pacientesService.js"
import { listarTerapeutas } from "@/services/terapeutasService.js"
import { listarCitas } from "@/services/citasService.js"
import "../../AdminHome/AdminDashboard.css"

const escaparCsv = (valor) => {
  const texto = valor == null ? "" : String(valor)
  return `"${texto.replace(/"/g, '""')}"`
}

const descargarCsv = (filas, nombreArchivo) => {
  const contenido = filas.map((fila) => fila.map(escaparCsv).join(",")).join("\n")
  const blob = new Blob([`\uFEFF${contenido}`], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement("a")
  enlace.href = url
  enlace.download = nombreArchivo
  enlace.click()
  URL.revokeObjectURL(url)
}

const Reportes = () => {
  const [citas, setCitas] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [terapeutas, setTerapeutas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [periodo, setPeriodo] = useState("mes") // semana, mes, trimestre, año

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [citasData, pacientesData, terapeutasData] = await Promise.all([
          listarCitas(),
          listarPacientes(),
          listarTerapeutas(),
        ])
        setCitas(citasData)
        setPacientes(pacientesData)
        setTerapeutas(terapeutasData)
      } catch (err) {
        setError("Error al cargar los datos")
        console.error("Error loading data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Calcular estadísticas
  const totalPacientes = pacientes.length
  const pacientesActivos = pacientes.filter((p) => p.activo === true).length
  const totalTerapeutas = terapeutas.length
  const terapeutasActivos = terapeutas.filter((t) => t.activo === true).length
  const totalCitas = citas.length
  const citasCompletadas = citas.filter((c) => c.estado === "Completada").length
  const citasProgramadas = citas.filter((c) => c.estado === "Programada").length
  const citasCanceladas = citas.filter((c) => c.estado === "Cancelada" || c.estado === "Inasistencia").length

  // Distribución de estados de citas
  const estadoCitasData = [
    { name: "Completadas", value: citasCompletadas, color: "#10b981" },
    { name: "Programadas", value: citasProgramadas, color: "#3b82f6" },
    { name: "Canceladas", value: citasCanceladas, color: "#ef4444" },
  ]

  // Citas por terapeuta
  const citasPorTerapeuta = terapeutas.map((terapeuta) => ({
    nombre: terapeuta.nombres?.split(" ")[0] ?? terapeuta.nombre ?? "Sin nombre",
    citas: citas.filter((c) => c.idTerapeuta === terapeuta.id).length,
    completadas: citas.filter((c) => c.idTerapeuta === terapeuta.id && c.estado === "Completada").length,
  }))

  // Tendencia mensual de citas (últimos 6 meses)
  const getMonthlyData = () => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const currentMonth = new Date().getMonth()
    const data = []

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12
      const monthName = months[monthIndex]
      const citasDelMes = citas.filter((c) => {
        const citaMonth = new Date(c.fecha).getMonth()
        return citaMonth === monthIndex
      })

      data.push({
        mes: monthName,
        total: citasDelMes.length,
        completadas: citasDelMes.filter((c) => c.estado === "Completada").length,
        canceladas: citasDelMes.filter((c) => c.estado === "Cancelada" || c.estado === "Inasistencia").length,
      })
    }

    return data
  }

  const monthlyData = getMonthlyData()

  // Distribución por género
  const generoData = [
    { name: "Masculino", value: pacientes.filter((p) => p.genero === "M").length, color: "#3b82f6" },
    { name: "Femenino", value: pacientes.filter((p) => p.genero === "F").length, color: "#ec4899" },
    { name: "Otro", value: pacientes.filter((p) => p.genero === "Otro").length, color: "#8b5cf6" },
  ]

  const tasaCompletitud = totalCitas > 0 ? ((citasCompletadas / totalCitas) * 100).toFixed(1) : "0"
  const tasaCancelacion = totalCitas > 0 ? ((citasCanceladas / totalCitas) * 100).toFixed(1) : "0"

  // Exportar reporte sin dependencias vulnerables de hojas de calculo.
  const handleExport = () => {
    const filas = [
      ["Paciente", "Terapeuta", "Fecha", "Estado"],
      ...citas.map((c) => [
        c.paciente?.nombreCompleto || "N/A",
        c.terapeuta?.nombres || "N/A",
        c.fecha ? new Date(c.fecha).toLocaleDateString() : "N/A",
        c.estado || "N/A",
      ]),
    ]
    descargarCsv(filas, "reportes_clinica.csv")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <FileText className="w-10 h-10 text-purple-600" />
              Reportes y Estadísticas
            </h1>
            <p className="text-gray-600 text-lg">Análisis completo y métricas de la clínica</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="semana">Última semana</option>
              <option value="mes">Último mes</option>
              <option value="trimestre">Último trimestre</option>
              <option value="año">Último año</option>
            </select>
            <button
              onClick={handleExport}
              className="px-6 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Exportar
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando reportes...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-800">{error}</div>
        ) : (
          <>
            {/* Métricas Clave */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Pacientes</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalPacientes}</h3>
                <p className="text-sm text-gray-600">{pacientesActivos} activos</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Stethoscope className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Terapeutas</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalTerapeutas}</h3>
                <p className="text-sm text-gray-600">{terapeutasActivos} activos</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Total Citas</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalCitas}</h3>
                <p className="text-sm text-gray-600">{citasProgramadas} programadas</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Completitud</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{tasaCompletitud}%</h3>
                <p className="text-sm text-gray-600">{citasCompletadas} completadas</p>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tendencia de Citas</h3>
                <p className="text-sm text-gray-600 mb-6">Últimos 6 meses</p>
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
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Estados de Citas</h3>
                <p className="text-sm text-gray-600 mb-6">Distribución actual</p>
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
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Citas por Terapeuta</h3>
                <p className="text-sm text-gray-600 mb-6">Carga de trabajo</p>
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
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Distribución por Género</h3>
                <p className="text-sm text-gray-600 mb-6">Pacientes registrados</p>
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
              </div>
            </div>

            {/* Estadísticas Adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  Rendimiento General
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tasa de Completitud</span>
                    <span className="font-semibold text-gray-900">{tasaCompletitud}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tasa de Cancelación</span>
                    <span className="font-semibold text-gray-900">{tasaCancelacion}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Promedio/Terapeuta</span>
                    <span className="font-semibold text-gray-900">
                      {totalTerapeutas > 0 ? (totalCitas / totalTerapeutas).toFixed(1) : "0"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Estadísticas de Pacientes
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pacientes Activos</span>
                    <span className="font-semibold text-green-600">{pacientesActivos}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pacientes Inactivos</span>
                    <span className="font-semibold text-gray-600">{totalPacientes - pacientesActivos}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nuevos este mes</span>
                    <span className="font-semibold text-blue-600">
                      {
                        pacientes.filter((p) => {
                          if (!p.fechaRegistro) return false
                          const registro = new Date(p.fechaRegistro)
                          const hoy = new Date()
                          return registro.getMonth() === hoy.getMonth() && registro.getFullYear() === hoy.getFullYear()
                        }).length
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Resumen de Citas
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completadas</span>
                    <span className="font-semibold text-green-600">{citasCompletadas}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Programadas</span>
                    <span className="font-semibold text-blue-600">{citasProgramadas}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Canceladas</span>
                    <span className="font-semibold text-red-600">{citasCanceladas}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Reportes
