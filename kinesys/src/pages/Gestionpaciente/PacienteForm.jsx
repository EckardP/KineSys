"use client"

import { useState, useEffect } from "react"
import { X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { listarSeguros, crearSeguros } from "../../../services/segurosService"
import { listarEPS, crearEPS } from "../../../services/epsService"

const formatDateForInput = (dateString) => {
  if (!dateString) return ""

  if (typeof dateString === "string" && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString
  }

  if (typeof dateString === "string" && dateString.includes("T")) {
    return dateString.split("T")[0]
  }

  if (dateString instanceof Date) {
    return dateString.toISOString().split("T")[0]
  }

  return ""
}

export default function PatientForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    tipoDocumento: "CC",
    documentoIdentidad: "",
    telefono: "",
    celular: "",
    correoElectronico: "",
    fechaNacimiento: "",
    genero: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    idSeguroMedico: "",
    epsId: "",
    numeroDeAfiliacion: "",
    tipoAfiliado: "",
    estadoAfiliacion: true,
    fechaAfiliacion: "",
    regimen: "",
    rol: 1,
  })

  useEffect(() => {
    if (initialData) {
      console.log("📥 Cargando datos iniciales para edición:", initialData)

      const formattedData = {
        ...initialData,
        fechaNacimiento: formatDateForInput(initialData.fechaNacimiento),
        fechaAfiliacion: formatDateForInput(initialData.fechaAfiliacion),
        numeroDeAfiliacion: initialData.numeroDeAfiliacion || "",
        epsId: initialData.epsId || "",
        idSeguroMedico: initialData.idSeguroMedico || "",
        telefono: initialData.telefono || "",
        celular: initialData.celular || "",
        direccion: initialData.direccion || "",
        ciudad: initialData.ciudad || "",
        departamento: initialData.departamento || "",
        tipoAfiliado: initialData.tipoAfiliado || "",
        regimen: initialData.regimen || "",
        estadoAfiliacion: initialData.estadoAfiliacion ?? true,
      }

      console.log("📤 Datos formateados:", formattedData)
      setFormData(formattedData)
    }
  }, [initialData])

  const [seguros, setSeguros] = useState([])
  const [epsList, setEpsList] = useState([])
  const [loadingSeguros, setLoadingSeguros] = useState(false)
  const [loadingEPS, setLoadingEPS] = useState(false)
  const [showSeguroForm, setShowSeguroForm] = useState(false)
  const [showEPSForm, setShowEPSForm] = useState(false)
  const [nuevoSeguro, setNuevoSeguro] = useState({
    nombreAseguradora: "",
    numeroPoliza: "",
    cobertura: "",
  })
  const [nuevaEPS, setNuevaEPS] = useState({
    nombreEPS: "",
  })
  const [creandoSeguro, setCreandoSeguro] = useState(false)
  const [creandoEPS, setCreandoEPS] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name === "epsId" || name === "idSeguroMedico" || name === "numeroDeAfiliacion") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }))
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const cargarSeguros = async () => {
    try {
      console.log("🔄 PatientForm: Ejecutando cargarSeguros...")
      setLoadingSeguros(true)
      const segurosData = await listarSeguros()
      console.log("📦 PatientForm: Datos recibidos de listarSeguros:", segurosData)

      const segurosArray = Array.isArray(segurosData) ? segurosData : []
      console.log("🎯 PatientForm: Seguros a guardar en estado:", segurosArray)
      setSeguros(segurosArray)
    } catch (error) {
      console.error("❌ PatientForm: Error cargando seguros:", error)
      setSeguros([])
    } finally {
      setLoadingSeguros(false)
    }
  }

  const cargarEPS = async () => {
    try {
      console.log("🔄 PatientForm: Ejecutando cargarEPS...")
      setLoadingEPS(true)
      const epsData = await listarEPS()
      console.log("📦 PatientForm: Datos recibidos de listarEPS:", epsData)

      const epsArray = Array.isArray(epsData) ? epsData : []
      console.log("🎯 PatientForm: EPS a guardar en estado:", epsArray)
      setEpsList(epsArray)
    } catch (error) {
      console.error("❌ PatientForm: Error cargando EPS:", error)
      setEpsList([])
    } finally {
      setLoadingEPS(false)
    }
  }

  useEffect(() => {
    console.log("🚀 PatientForm: Montando componente, cargando datos...")
    cargarSeguros()
    cargarEPS()
  }, [])

  const handleSeguroChange = (e) => {
    const { name, value } = e.target
    setNuevoSeguro((prev) => ({ ...prev, [name]: value }))
  }

  const handleEPSChange = (e) => {
    const { name, value } = e.target
    setNuevaEPS((prev) => ({ ...prev, [name]: value }))
  }

  const handleAgregarSeguro = async () => {
    if (!nuevoSeguro.nombreAseguradora || !nuevoSeguro.numeroPoliza) {
      alert("Por favor complete los campos obligatorios del seguro")
      return
    }

    try {
      setCreandoSeguro(true)
      const seguroCreado = await crearSeguros({
        ...nuevoSeguro,
        activo: true,
      })

      await cargarSeguros()

      if (seguroCreado && seguroCreado.idSeguro) {
        setFormData((prev) => ({
          ...prev,
          idSeguroMedico: seguroCreado.idSeguro.toString(),
        }))
      }

      setNuevoSeguro({
        nombreAseguradora: "",
        numeroPoliza: "",
        cobertura: "",
      })
      setShowSeguroForm(false)
    } catch (error) {
      alert(error.message || "Error al crear el seguro")
    } finally {
      setCreandoSeguro(false)
    }
  }

  const handleAgregarEPS = async () => {
    if (!nuevaEPS.nombreEPS) {
      alert("Por favor ingrese el nombre de la EPS")
      return
    }
    try {
      setCreandoEPS(true)
      const epsCreada = await crearEPS({
        nombreEPS: nuevaEPS.nombreEPS,
      })

      await cargarEPS()

      if (epsCreada && epsCreada.epsId) {
        setFormData((prev) => ({
          ...prev,
          epsId: epsCreada.epsId.toString(),
        }))
      }

      setNuevaEPS({ nombreEPS: "" })
      setShowEPSForm(false)
    } catch (error) {
      alert(error.message || "Error al crear la EPS")
    } finally {
      setCreandoEPS(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("🔄 handleSubmit: Iniciando envío del formulario...")

    if (!formData.documentoIdentidad || !formData.nombres || !formData.apellidos || !formData.tipoDocumento) {
      console.log("❌ Validación fallida: Campos obligatorios incompletos")
      alert("Por favor complete los campos obligatorios")
      return
    }

    if (formData.epsId && formData.epsId.trim() !== "") {
      if (!formData.numeroDeAfiliacion || !formData.tipoAfiliado || !formData.fechaAfiliacion || !formData.regimen) {
        console.log("❌ Validación fallida: Campos de EPS incompletos")
        alert("Por favor complete todos los campos de afiliación EPS")
        return
      }
    }

    console.log("✅ Todas las validaciones pasaron")

    const datosComunes = {
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      tipoDocumento: formData.tipoDocumento,
      documentoIdentidad: formData.documentoIdentidad,
      telefono: formData.telefono,
      celular: formData.celular || "",
      correoElectronico: formData.correoElectronico,
      fechaNacimiento: formData.fechaNacimiento ? new Date(formData.fechaNacimiento).toISOString() : null,
      genero: formData.genero,
      direccion: formData.direccion,
      ciudad: formData.ciudad || "",
      departamento: formData.departamento || "",
      activo: true,
      rol: 1,
      idSeguroMedico: formData.idSeguroMedico ? Number.parseInt(formData.idSeguroMedico) : null,
      epsId: formData.epsId ? Number.parseInt(formData.epsId) : null,
      numeroDeAfiliacion: formData.epsId ? Number.parseInt(formData.numeroDeAfiliacion) || 0 : 0,
      tipoAfiliado: formData.epsId ? formData.tipoAfiliado : "",
      estadoAfiliacion: formData.epsId
        ? formData.estadoAfiliacion === "true" || formData.estadoAfiliacion === true
        : true,
      fechaAfiliacion:
        formData.epsId && formData.fechaAfiliacion ? new Date(formData.fechaAfiliacion).toISOString() : null,
      regimen: formData.epsId ? formData.regimen : "",
    }

    const datosParaEnviar = initialData
      ? datosComunes
      : {
          ...datosComunes,
          user: formData.documentoIdentidad,
          password: formData.documentoIdentidad,
          fechaRegistro: new Date().toISOString(),
        }

    console.log("📤 Datos preparados para enviar:", datosParaEnviar)
    console.log("🎯 Llamando a onSubmit...")

    onSubmit(datosParaEnviar)
  }

  const segurosValidos = Array.isArray(seguros)
    ? seguros.filter((seguro) => {
        const tieneId = seguro?.idSeguro != null && seguro.idSeguro.toString().trim() !== ""
        const tieneNombre = seguro?.nombreAseguradora && seguro.nombreAseguradora.trim() !== ""
        return tieneId && tieneNombre
      })
    : []

  const epsValidas = Array.isArray(epsList)
    ? epsList.filter((eps) => {
        const tieneId = eps?.epsId != null && eps.epsId.toString().trim() !== ""
        const tieneNombre = eps?.nombreEPS && eps.nombreEPS.trim() !== ""
        return tieneId && tieneNombre
      })
    : []

  const mostrarAfiliacionEPS = formData.epsId != null && formData.epsId !== "" && formData.epsId !== 0

  console.log("🔍 Estado actual de formData:", {
    epsId: formData.epsId,
    tipoEpsId: typeof formData.epsId,
    fechaNacimiento: formData.fechaNacimiento,
    fechaAfiliacion: formData.fechaAfiliacion,
  })

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? "Editar Paciente" : "Registrar Nuevo Paciente"}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded transition-colors">
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Personal */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Información Personal</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="tipoDocumento" className="text-gray-700">
                Tipo Documento *
              </Label>
              <Select
                value={formData.tipoDocumento}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, tipoDocumento: value }))}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                  <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                  <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                  <SelectItem value="PA">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="documentoIdentidad" className="text-gray-700">
                Número Documento *
              </Label>
              <Input
                id="documentoIdentidad"
                name="documentoIdentidad"
                value={formData.documentoIdentidad}
                onChange={handleChange}
                placeholder="1234567890"
                className="border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="genero" className="text-gray-700">
                Género
              </Label>
              <Select
                value={formData.genero}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, genero: value }))}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Femenino</SelectItem>
                  <SelectItem value="O">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="nombres" className="text-gray-700">
                Nombres *
              </Label>
              <Input
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                className="border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="apellidos" className="text-gray-700">
                Apellidos *
              </Label>
              <Input
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className="border-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <Label htmlFor="fechaNacimiento" className="text-gray-700">
                Fecha Nacimiento
              </Label>
              <Input
                id="fechaNacimiento"
                name="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento || ""}
                onChange={handleChange}
                className="border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="correoElectronico" className="text-gray-700">
                Email
              </Label>
              <Input
                id="correoElectronico"
                name="correoElectronico"
                type="email"
                value={formData.correoElectronico}
                onChange={handleChange}
                className="border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="celular" className="text-gray-700">
                Celular
              </Label>
              <Input
                id="celular"
                name="celular"
                type="tel"
                value={formData.celular}
                onChange={handleChange}
                className="border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Contacto y Ubicación */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Contacto y Ubicación</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="telefono" className="text-gray-700">
                Teléfono
              </Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                className="border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="ciudad" className="text-gray-700">
                Ciudad
              </Label>
              <Input
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="departamento" className="text-gray-700">
                Departamento
              </Label>
              <Input
                id="departamento"
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                className="border-gray-300"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="direccion" className="text-gray-700">
              Dirección Completa
            </Label>
            <Input
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="border-gray-300"
            />
          </div>
        </div>

        {/* EPS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">EPS</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowEPSForm(!showEPSForm)}
              className="border-gray-300"
              disabled={creandoEPS}
            >
              <Plus size={16} className="mr-2" />
              {showEPSForm ? "Cancelar" : "Agregar EPS"}
            </Button>
          </div>

          {showEPSForm && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Nueva EPS</h4>
              <div>
                <Label htmlFor="nombreEPS" className="text-gray-700">
                  Nombre de la EPS *
                </Label>
                <Input
                  id="nombreEPS"
                  name="nombreEPS"
                  value={nuevaEPS.nombreEPS}
                  onChange={handleEPSChange}
                  placeholder="Ingrese el nombre de la EPS"
                  className="border-gray-300"
                  disabled={creandoEPS}
                />
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEPSForm(false)
                    setNuevaEPS({ nombreEPS: "" })
                  }}
                  className="border-gray-300"
                  disabled={creandoEPS}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleAgregarEPS}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                  disabled={creandoEPS}
                >
                  {creandoEPS ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    "Guardar EPS"
                  )}
                </Button>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="epsId" className="text-gray-700">
              Seleccionar EPS
            </Label>
            <Select
              value={formData.epsId?.toString() || "0"} // Updated default value to be a non-empty string
              onValueChange={(value) => setFormData((prev) => ({ ...prev, epsId: value }))}
            >
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder={loadingEPS ? "Cargando..." : "Seleccionar EPS"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sin EPS</SelectItem>
                {epsValidas.map((eps) => (
                  <SelectItem key={eps.epsId} value={eps.epsId.toString()}>
                    {eps.nombreEPS}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Información de Afiliación EPS */}
        {mostrarAfiliacionEPS && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Información de Afiliación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numeroDeAfiliacion" className="text-gray-700">
                  Número de Afiliación *
                </Label>
                <Input
                  id="numeroDeAfiliacion"
                  name="numeroDeAfiliacion"
                  type="number"
                  value={formData.numeroDeAfiliacion}
                  onChange={handleChange}
                  placeholder="123456789"
                  className="border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="tipoAfiliado" className="text-gray-700">
                  Tipo de Afiliado *
                </Label>
                <Select
                  value={formData.tipoAfiliado}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, tipoAfiliado: value }))}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cotizante">Cotizante</SelectItem>
                    <SelectItem value="Beneficiario">Beneficiario</SelectItem>
                    <SelectItem value="Adicional">Adicional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="regimen" className="text-gray-700">
                  Régimen *
                </Label>
                <Select
                  value={formData.regimen}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, regimen: value }))}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contributivo">Contributivo</SelectItem>
                    <SelectItem value="Subsidiado">Subsidiado</SelectItem>
                    <SelectItem value="Especial">Especial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fechaAfiliacion" className="text-gray-700">
                  Fecha de Afiliación *
                </Label>
                <Input
                  id="fechaAfiliacion"
                  name="fechaAfiliacion"
                  type="date"
                  value={formData.fechaAfiliacion || ""}
                  onChange={handleChange}
                  className="border-gray-300"
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="estadoAfiliacion"
                  name="estadoAfiliacion"
                  checked={formData.estadoAfiliacion}
                  onChange={handleChange}
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-400"
                />
                <Label htmlFor="estadoAfiliacion" className="text-gray-700 cursor-pointer">
                  Afiliación Activa
                </Label>
              </div>
            </div>
          </div>
        )}

        {/* Seguro Médico */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Seguro Médico</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSeguroForm(!showSeguroForm)}
              className="border-gray-300"
              disabled={creandoSeguro}
            >
              <Plus size={16} className="mr-2" />
              {showSeguroForm ? "Cancelar" : "Agregar Seguro"}
            </Button>
          </div>

          {showSeguroForm && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Nuevo Seguro Médico</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombreAseguradora" className="text-gray-700">
                    Aseguradora *
                  </Label>
                  <Input
                    id="nombreAseguradora"
                    name="nombreAseguradora"
                    value={nuevoSeguro.nombreAseguradora}
                    onChange={handleSeguroChange}
                    placeholder="Nombre de la aseguradora"
                    className="border-gray-300"
                    disabled={creandoSeguro}
                  />
                </div>
                <div>
                  <Label htmlFor="numeroPoliza" className="text-gray-700">
                    Número Póliza *
                  </Label>
                  <Input
                    id="numeroPoliza"
                    name="numeroPoliza"
                    value={nuevoSeguro.numeroPoliza}
                    onChange={handleSeguroChange}
                    placeholder="Número de póliza"
                    className="border-gray-300"
                    disabled={creandoSeguro}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="cobertura" className="text-gray-700">
                  Cobertura
                </Label>
                <Textarea
                  id="cobertura"
                  name="cobertura"
                  value={nuevoSeguro.cobertura}
                  onChange={handleSeguroChange}
                  rows={2}
                  placeholder="Descripción de la cobertura"
                  className="border-gray-300"
                  disabled={creandoSeguro}
                />
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowSeguroForm(false)
                    setNuevoSeguro({
                      nombreAseguradora: "",
                      numeroPoliza: "",
                      cobertura: "",
                    })
                  }}
                  className="border-gray-300"
                  disabled={creandoSeguro}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleAgregarSeguro}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                  disabled={creandoSeguro}
                >
                  {creandoSeguro ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    "Guardar Seguro"
                  )}
                </Button>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="idSeguroMedico" className="text-gray-700">
              Seleccionar Seguro
            </Label>
            <Select
              value={formData.idSeguroMedico?.toString() || "0"} // Updated default value to be a non-empty string
              onValueChange={(value) => setFormData((prev) => ({ ...prev, idSeguroMedico: value }))}
            >
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder={loadingSeguros ? "Cargando..." : "Seleccionar Seguro"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sin Seguro</SelectItem>
                {segurosValidos.map((seguro) => (
                  <SelectItem key={seguro.idSeguro} value={seguro.idSeguro.toString()}>
                    {seguro.nombreAseguradora} - {seguro.numeroPoliza}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
            disabled={creandoSeguro || creandoEPS}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-gray-900 hover:bg-gray-800 text-white"
            disabled={creandoSeguro || creandoEPS}
          >
            {initialData ? "Actualizar" : "Guardar Paciente"}
          </Button>
        </div>
      </form>
    </div>
  )
}
