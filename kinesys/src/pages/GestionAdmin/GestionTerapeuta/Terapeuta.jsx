"use client"

import { useState, useEffect } from "react"
import { crearTerapeuta, listarTerapeutas, actualizarTerapeuta, eliminarTerapeuta } from "../../../services/terapeutasService"
import { crearDisponibilidad, obtenerDisponibilidadPorTerapeuta, eliminarDisponibilidad } from "../../../services/disponibilidadTerapeutaService"
import { listarEspecialidades, crearEspecialidad } from "../../../services/especialidadesService"
import { User, Mail, Phone, MapPin, Briefcase, Award, Calendar, Edit, Trash2, UserPlus, Clock, Plus } from "lucide-react"

export default function Terapeutas() {
  const [terapeutas, setTerapeutas] = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [modoEdicion, setModoEdicion] = useState(false)
  const [showEspecialidadForm, setShowEspecialidadForm] = useState(false)
  const [showHorariosForm, setShowHorariosForm] = useState(false)
  const [terapeutaHorarios, setTerapeutaHorarios] = useState(null)
  const [creandoEspecialidad, setCreandoEspecialidad] = useState(false)
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState({
    nombre: "",
    descripcion: ""
  })
  const [nuevoHorario, setNuevoHorario] = useState({
    diaSemana: "",
    horaInicio: "",
    horaFin: "",
    disponible: true,
    tipoAmbiente: ""
  })
  const [horariosExistentes, setHorariosExistentes] = useState([])

  const [formData, setFormData] = useState({
    user: "",
    password: "",
    nombres: "",
    apellidos: "",
    tipoDocumento: "",
    documentoIdentidad: "",
    telefono: "",
    celular: "",
    correoElectronico: "",
    fechaNacimiento: "",
    genero: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    activo: true,
    fechaRegistro: new Date().toISOString(),
    rol: 2,
    noLicencia: "",
    tituloAcademico: "",
    añosExperiencia: "",
    fechaContratacion: "",
    idEspecialidad: ""
  })

  // 🔹 Cargar terapeutas y especialidades al iniciar
  useEffect(() => {
    cargarTerapeutas()
    cargarEspecialidades()
  }, [])

  const cargarTerapeutas = async () => {
    try {
      const data = await listarTerapeutas()
      const normalizados = (data || []).map((t) => ({
        id: t.id,
        user: t.user,
        nombres: t.nombres,
        apellidos: t.apellidos,
        tipoDocumento: t.tipoDocumento,
        documentoIdentidad: t.documentoIdentidad,
        telefono: t.telefono,
        celular: t.celular,
        correoElectronico: t.correoElectronico,
        fechaNacimiento: t.fechaNacimiento,
        genero: t.genero,
        direccion: t.direccion,
        ciudad: t.ciudad,
        departamento: t.departamento,
        activo: t.activo,
        fechaRegistro: t.fechaRegistro,
        rol: t.rol,
        noLicencia: t.noLicencia,
        tituloAcademico: t.tituloAcademico,
        añosExperiencia: t.añosExperiencia,
        fechaContratacion: t.fechaContratacion,
        idEspecialidad: t.idEspecialidad
      }))
      setTerapeutas(normalizados)
    } catch (error) {
      console.error("Error al listar terapeutas:", error)
    }
  }

  const cargarEspecialidades = async () => {
    try {
      const data = await listarEspecialidades()
      setEspecialidades(data || [])
    } catch (error) {
      console.error("Error al cargar especialidades:", error)
    }
  }

  const cargarHorariosTerapeuta = async (terapeutaId) => {
    try {
      const data = await obtenerDisponibilidadPorTerapeuta(terapeutaId)
      setHorariosExistentes(data || [])
    } catch (error) {
      console.error("Error al cargar horarios:", error)
      setHorariosExistentes([])
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleEspecialidadChange = (e) => {
    const { name, value } = e.target
    setNuevaEspecialidad({ ...nuevaEspecialidad, [name]: value })
  }

  const handleHorarioChange = (e) => {
    const { name, value, type, checked } = e.target
    setNuevoHorario({ 
      ...nuevoHorario, 
      [name]: type === 'checkbox' ? checked : value 
    })
  }

  // 🔹 Guardar o actualizar terapeuta
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const datosTerapeuta = {
        user: formData.documentoIdentidad, // Se autogenera del documento
        password: formData.documentoIdentidad, // Se autogenera del documento
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        tipoDocumento: formData.tipoDocumento,
        documentoIdentidad: formData.documentoIdentidad,
        telefono: formData.telefono,
        celular: formData.celular,
        correoElectronico: formData.correoElectronico,
        fechaNacimiento: formData.fechaNacimiento
          ? new Date(formData.fechaNacimiento).toISOString()
          : new Date().toISOString(),
        genero: formData.genero,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        departamento: formData.departamento,
        activo: true,
        fechaRegistro: new Date().toISOString(),
        rol: 2,
        noLicencia: formData.noLicencia,
        tituloAcademico: formData.tituloAcademico,
        añosExperiencia: Number(formData.añosExperiencia) || 0,
        fechaContratacion: formData.fechaContratacion
          ? new Date(formData.fechaContratacion).toISOString()
          : new Date().toISOString(),
        idEspecialidad: formData.idEspecialidad ? Number(formData.idEspecialidad) : null
      }

      if (modoEdicion && formData.id) {
        // Para actualizar, no envíes password ni campos de registro
        const { password, fechaRegistro, rol, ...datosActualizacion } = datosTerapeuta
        await actualizarTerapeuta(formData.id, datosActualizacion)
      } else {
        // Para crear nuevo terapeuta
        await crearTerapeuta(datosTerapeuta)
      }

      await cargarTerapeutas()
      limpiarFormulario()
    } catch (error) {
      console.error(error)
      alert(error.message || "Error al crear/actualizar terapeuta")
    }
  }

  const limpiarFormulario = () => {
    setFormData({
      user: "",
      password: "",
      nombres: "",
      apellidos: "",
      tipoDocumento: "",
      documentoIdentidad: "",
      telefono: "",
      celular: "",
      correoElectronico: "",
      fechaNacimiento: "",
      genero: "",
      direccion: "",
      ciudad: "",
      departamento: "",
      activo: true,
      fechaRegistro: new Date().toISOString(),
      rol: 2,
      noLicencia: "",
      tituloAcademico: "",
      añosExperiencia: "",
      fechaContratacion: "",
      idEspecialidad: ""
    })
    setModoEdicion(false)
  }

  // 🔹 Agregar nueva especialidad
  const handleAgregarEspecialidad = async () => {
    if (!nuevaEspecialidad.nombre.trim()) {
      alert("El nombre de la especialidad es requerido")
      return
    }

    setCreandoEspecialidad(true)
    try {
      await crearEspecialidad(nuevaEspecialidad)
      await cargarEspecialidades()
      setNuevaEspecialidad({ nombre: "", descripcion: "" })
      setShowEspecialidadForm(false)
    } catch (error) {
      console.error("Error al crear especialidad:", error)
      alert(error.message || "Error al crear especialidad")
    } finally {
      setCreandoEspecialidad(false)
    }
  }

  // 🔹 Agregar horario al terapeuta
  const handleAgregarHorario = async () => {
    if (!nuevoHorario.diaSemana || !nuevoHorario.horaInicio || !nuevoHorario.horaFin) {
      alert("Día de la semana, hora de inicio y hora de fin son requeridos")
      return
    }

    try {
      const datosHorario = {
        idTerapeuta: terapeutaHorarios.id,
        diaSemana: nuevoHorario.diaSemana,
        horaInicio: nuevoHorario.horaInicio,
        horaFin: nuevoHorario.horaFin,
        disponible: nuevoHorario.disponible,
        tipoAmbiente: nuevoHorario.tipoAmbiente || "Consultorio"
      }

      await crearDisponibilidad(datosHorario)
      await cargarHorariosTerapeuta(terapeutaHorarios.id)
      setNuevoHorario({
        diaSemana: "",
        horaInicio: "",
        horaFin: "",
        disponible: true,
        tipoAmbiente: ""
      })
    } catch (error) {
      console.error("Error al agregar horario:", error)
      alert(error.message || "Error al agregar horario")
    }
  }

  // 🔹 Eliminar horario
  const handleEliminarHorario = async (idHorario) => {
    if (window.confirm("¿Seguro que deseas eliminar este horario?")) {
      try {
        await eliminarDisponibilidad(idHorario)
        await cargarHorariosTerapeuta(terapeutaHorarios.id)
      } catch (error) {
        console.error("Error al eliminar horario:", error)
        alert("Error al eliminar horario")
      }
    }
  }

  // 🔹 Abrir modal de horarios
  const abrirModalHorarios = async (terapeuta) => {
    setTerapeutaHorarios(terapeuta)
    setShowHorariosForm(true)
    await cargarHorariosTerapeuta(terapeuta.id)
  }

  // 🔹 Cerrar modal de horarios
  const cerrarModalHorarios = () => {
    setShowHorariosForm(false)
    setTerapeutaHorarios(null)
    setHorariosExistentes([])
    setNuevoHorario({
      diaSemana: "",
      horaInicio: "",
      horaFin: "",
      disponible: true,
      tipoAmbiente: ""
    })
  }

  // 🔹 Editar terapeuta
  const handleEdit = (terapeuta) => {
    setFormData({
      ...terapeuta,
      fechaNacimiento: terapeuta.fechaNacimiento ? terapeuta.fechaNacimiento.split("T")[0] : "",
      fechaContratacion: terapeuta.fechaContratacion ? terapeuta.fechaContratacion.split("T")[0] : "",
      idEspecialidad: terapeuta.idEspecialidad?.toString() || "",
      password: "" // No mostramos la password en edición por seguridad
    })
    setModoEdicion(true)
  }

  // 🔹 Eliminar terapeuta
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este terapeuta?")) {
      try {
        await eliminarTerapeuta(id)
        await cargarTerapeutas()
      } catch (error) {
        console.error("Error al eliminar terapeuta:", error)
        alert("Error al eliminar terapeuta")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Briefcase className="w-10 h-10 text-indigo-600" />
            Gestión de Terapeutas
          </h1>
          <p className="text-gray-600 text-lg">Registra, visualiza y administra el equipo de terapeutas</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            {modoEdicion ? (
              <Edit className="w-6 h-6 text-amber-600" />
            ) : (
              <UserPlus className="w-6 h-6 text-indigo-600" />
            )}
            {modoEdicion ? "Editar Terapeuta" : "Registrar Nuevo Terapeuta"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombres *</label>
                  <input
                    type="text"
                    name="nombres"
                    placeholder="Nombres completos"
                    value={formData.nombres}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos *</label>
                  <input
                    type="text"
                    name="apellidos"
                    placeholder="Apellidos completos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                  <select
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="">Seleccionar</option>
                    <option value="DNI">DNI</option>
                    <option value="Cédula">Cédula</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Documento de Identidad *</label>
                  <input
                    type="text"
                    name="documentoIdentidad"
                    placeholder="Número de documento"
                    value={formData.documentoIdentidad}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
                  <select
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                    <option value="Prefiero no decir">Prefiero no decir</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-indigo-600" />
                Información de Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    placeholder="Número de teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Celular
                  </label>
                  <input
                    type="text"
                    name="celular"
                    placeholder="Número de celular"
                    value={formData.celular}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="correoElectronico"
                    placeholder="correo@ejemplo.com"
                    value={formData.correoElectronico}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    placeholder="Dirección completa"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                  <input
                    type="text"
                    name="ciudad"
                    placeholder="Ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                  <input
                    type="text"
                    name="departamento"
                    placeholder="Departamento"
                    value={formData.departamento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Especialidad */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  Especialidad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowEspecialidadForm(!showEspecialidadForm)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  disabled={creandoEspecialidad}
                >
                  <Plus size={16} />
                  {showEspecialidadForm ? "Cancelar" : "Agregar Especialidad"}
                </button>
              </div>

              {/* Formulario para nueva especialidad */}
              {showEspecialidadForm && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Nueva Especialidad</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Especialidad *</label>
                      <input
                        type="text"
                        name="nombre"
                        value={nuevaEspecialidad.nombre}
                        onChange={handleEspecialidadChange}
                        placeholder="Ingrese el nombre de la especialidad"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        disabled={creandoEspecialidad}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                      <input
                        type="text"
                        name="descripcion"
                        value={nuevaEspecialidad.descripcion}
                        onChange={handleEspecialidadChange}
                        placeholder="Descripción de la especialidad"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        disabled={creandoEspecialidad}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEspecialidadForm(false)
                        setNuevaEspecialidad({ nombre: "", descripcion: "" })
                      }}
                      className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      disabled={creandoEspecialidad}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleAgregarEspecialidad}
                      className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                      disabled={creandoEspecialidad}
                    >
                      {creandoEspecialidad ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Guardando...
                        </>
                      ) : (
                        'Guardar Especialidad'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Selector de especialidades existentes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Especialidad</label>
                <select
                  name="idEspecialidad"
                  value={formData.idEspecialidad}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="">Seleccionar especialidad</option>
                  {especialidades.map((esp) => (
                    <option key={esp.id} value={esp.id}>
                      {esp.nombre}
                    </option>
                  ))}
                </select>
                {especialidades.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    No hay especialidades registradas. Puede agregar una nueva.
                  </p>
                )}
              </div>
            </div>

            {/* Información Profesional */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                Información Profesional
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Licencia *</label>
                  <input
                    type="text"
                    name="noLicencia"
                    placeholder="Número de licencia profesional"
                    value={formData.noLicencia}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título Académico *</label>
                  <input
                    type="text"
                    name="tituloAcademico"
                    placeholder="Ej: Lic. en Fisioterapia"
                    value={formData.tituloAcademico}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Años de Experiencia</label>
                  <input
                    type="number"
                    name="añosExperiencia"
                    placeholder="0"
                    value={formData.añosExperiencia}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Fecha de Contratación
                  </label>
                  <input
                    type="date"
                    name="fechaContratacion"
                    value={formData.fechaContratacion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-3 pt-6">
              {modoEdicion && (
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                {modoEdicion ? (
                  <>
                    <Edit className="w-5 h-5" />
                    Actualizar Terapeuta
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Registrar Terapeuta
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tabla de Terapeutas */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-indigo-600" />
              Terapeutas Registrados
              <span className="ml-auto text-sm font-normal text-gray-500">
                {terapeutas.length} {terapeutas.length === 1 ? "terapeuta" : "terapeutas"}
              </span>
            </h2>
          </div>

          {terapeutas.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay terapeutas registrados</p>
              <p className="text-gray-400 mt-2">Comienza registrando tu primer terapeuta</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nombre Completo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Licencia
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Experiencia
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {terapeutas.map((t, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span className="font-medium text-gray-900">{t.user}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {t.nombres} {t.apellidos}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{t.noLicencia}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{t.tituloAcademico}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {t.añosExperiencia} años
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {t.telefono}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3" />
                            {t.correoElectronico}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => abrirModalHorarios(t)}
                          className="text-green-600 hover:text-green-900 inline-flex items-center gap-1 transition-colors"
                        >
                          <Clock className="w-4 h-4" />
                          Horarios
                        </button>
                        <button
                          onClick={() => handleEdit(t)}
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Horarios */}
      {showHorariosForm && terapeutaHorarios && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-6 h-6 text-indigo-600" />
                Gestión de Horarios - {terapeutaHorarios.nombres} {terapeutaHorarios.apellidos}
              </h2>
            </div>

            <div className="p-6">
              {/* Formulario para nuevo horario */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Agregar Nuevo Horario</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Día de la Semana *</label>
                    <select
                      name="diaSemana"
                      value={nuevoHorario.diaSemana}
                      onChange={handleHorarioChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                      <option value="">Seleccionar día</option>
                      <option value="Lunes">Lunes</option>
                      <option value="Martes">Martes</option>
                      <option value="Miércoles">Miércoles</option>
                      <option value="Jueves">Jueves</option>
                      <option value="Viernes">Viernes</option>
                      <option value="Sábado">Sábado</option>
                      <option value="Domingo">Domingo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Ambiente</label>
                    <select
                      name="tipoAmbiente"
                      value={nuevoHorario.tipoAmbiente}
                      onChange={handleHorarioChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                      <option value="Consultorio">Consultorio</option>
                      <option value="Virtual">Virtual</option>
                      <option value="Domicilio">Domicilio</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Inicio *</label>
                    <input
                      type="time"
                      name="horaInicio"
                      value={nuevoHorario.horaInicio}
                      onChange={handleHorarioChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Fin *</label>
                    <input
                      type="time"
                      name="horaFin"
                      value={nuevoHorario.horaFin}
                      onChange={handleHorarioChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="disponible"
                        checked={nuevoHorario.disponible}
                        onChange={handleHorarioChange}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Disponible</span>
                    </label>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleAgregarHorario}
                    className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Horario
                  </button>
                </div>
              </div>

              {/* Lista de horarios existentes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Horarios Registrados</h3>
                {horariosExistentes.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay horarios registrados para este terapeuta</p>
                ) : (
                  <div className="space-y-3">
                    {horariosExistentes.map((horario, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{horario.diaSemana}</div>
                          <div className="text-sm text-gray-600">
                            {horario.horaInicio} - {horario.horaFin} • {horario.tipoAmbiente}
                          </div>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                            horario.disponible 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {horario.disponible ? 'Disponible' : 'No disponible'}
                          </div>
                        </div>
                        <button
                          onClick={() => handleEliminarHorario(horario.idDisponibilidad)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={cerrarModalHorarios}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}