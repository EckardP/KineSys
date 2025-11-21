"use client"

import { useState, useEffect } from "react"
import { X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { listarSeguros, crearSeguros } from "../../../../services/segurosService"

export default function PatientForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      nombres: "",
      apellidos: "",
      tipoDocumento: "CC",
      documentoIdentidad: "",
      telefono: "",
      correoElectronico: "",
      fechaNacimiento: "",
      genero: "",
      direccion: "",
      idSeguroMedico: "",
    },
  )
  const [seguros, setSeguros] = useState([])
  const [loadingSeguros, setLoadingSeguros] = useState(false)
  const [showSeguroForm, setShowSeguroForm] = useState(false)
  const [nuevoSeguro, setNuevoSeguro] = useState({
    nombreAseguradora: "",
    numeroPoliza: "",
    cobertura: ""
  })
  const [creandoSeguro, setCreandoSeguro] = useState(false)

  // Cargar seguros disponibles
 const cargarSeguros = async () => {
    try {
      console.log("🔄 PatientForm: Ejecutando cargarSeguros...");
      setLoadingSeguros(true);
      const segurosData = await listarSeguros();
      console.log("📦 PatientForm: Datos recibidos de listarSeguros:", segurosData);
      console.log("📊 PatientForm: Tipo de datos:", typeof segurosData);
      console.log("🔢 PatientForm: Es array?", Array.isArray(segurosData));

      const segurosArray = Array.isArray(segurosData) ? segurosData : [];
      console.log("🎯 PatientForm: Seguros a guardar en estado:", segurosArray);
      setSeguros(segurosArray);
    } catch (error) {
      console.error('❌ PatientForm: Error cargando seguros:', error);
      setSeguros([]);
    } finally {
      setLoadingSeguros(false);
    }
  };

  useEffect(() => {
    console.log("🚀 PatientForm: Montando componente, cargando seguros...");
    cargarSeguros();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSeguroChange = (e) => {
    const { name, value } = e.target
    setNuevoSeguro((prev) => ({ ...prev, [name]: value }))
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
        activo: true
      })
      
      // Recargar la lista de seguros para incluir el nuevo
      await cargarSeguros()
      
      // Seleccionar automáticamente el nuevo seguro - usar idSeguro
      if (seguroCreado && seguroCreado.idSeguro) {
        setFormData(prev => ({ 
          ...prev, 
          idSeguroMedico: seguroCreado.idSeguro.toString() 
        }))
      }
      
      // Limpiar y cerrar el formulario de seguro
      setNuevoSeguro({
        nombreAseguradora: "",
        numeroPoliza: "",
        cobertura: ""
      })
      setShowSeguroForm(false)
      
    } catch (error) {
      alert(error.message || "Error al crear el seguro")
    } finally {
      setCreandoSeguro(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.documentoIdentidad || !formData.nombres || !formData.apellidos) {
      alert("Por favor complete los campos obligatorios")
      return
    }

    // Preparar datos para el endpoint
    const datosParaEnviar = {
      user: formData.documentoIdentidad,
      password: formData.documentoIdentidad,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      tipoDocumento: formData.tipoDocumento,
      documentoIdentidad: formData.documentoIdentidad,
      telefono: formData.telefono,
      correoElectronico: formData.correoElectronico,
      fechaNacimiento: formData.fechaNacimiento ? new Date(formData.fechaNacimiento).toISOString() : null,
      genero: formData.genero,
      direccion: formData.direccion,
      activo: true,
      fechaRegistro: new Date().toISOString(),
      rol: 4,
      // Usar idSeguroMedico que ahora contiene el idSeguro
      idSeguroMedico: formData.idSeguroMedico ? parseInt(formData.idSeguroMedico) : null
    }

    onSubmit(datosParaEnviar)
  }

  // Filtrar seguros válidos para el Select
  // En PatientForm, modifica la parte de segurosValidos:
// En PatientForm, reemplaza la función de segurosValidos:
const segurosValidos = Array.isArray(seguros) 
  ? seguros.filter(seguro => {
      console.log("🔍 Analizando seguro:", seguro);
      // Usar idSeguro en lugar de id
      const tieneId = seguro?.idSeguro != null && seguro.idSeguro.toString().trim() !== "";
      const tieneNombre = seguro?.nombreAseguradora && seguro.nombreAseguradora.trim() !== "";
      console.log(`   ✅ Tiene ID: ${tieneId}, Tiene nombre: ${tieneNombre}`);
      return tieneId && tieneNombre;
    })
  : [];

console.log("🎯 Seguros válidos después del filtro:", segurosValidos);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? "Editar Paciente" : "Registrar Nuevo Paciente"}
        </h2>
        <button 
          onClick={onCancel} 
          className="p-2 hover:bg-gray-100 rounded transition-colors"
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Personal */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Información Personal</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="tipoDocumento" className="text-gray-700">Tipo Documento *</Label>
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
              <Label htmlFor="documentoIdentidad" className="text-gray-700">Número Documento *</Label>
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
              <Label htmlFor="genero" className="text-gray-700">Género</Label>
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
              <Label htmlFor="nombres" className="text-gray-700">Nombres *</Label>
              <Input 
                id="nombres" 
                name="nombres" 
                value={formData.nombres} 
                onChange={handleChange} 
                className="border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="apellidos" className="text-gray-700">Apellidos *</Label>
              <Input 
                id="apellidos" 
                name="apellidos" 
                value={formData.apellidos} 
                onChange={handleChange} 
                className="border-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="fechaNacimiento" className="text-gray-700">Fecha Nacimiento</Label>
              <Input
                id="fechaNacimiento"
                name="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="correoElectronico" className="text-gray-700">Email</Label>
              <Input 
                id="correoElectronico" 
                name="correoElectronico" 
                type="email" 
                value={formData.correoElectronico} 
                onChange={handleChange} 
                className="border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefono" className="text-gray-700">Teléfono</Label>
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
              <Label htmlFor="direccion" className="text-gray-700">Dirección</Label>
              <Input 
                id="direccion" 
                name="direccion" 
                value={formData.direccion} 
                onChange={handleChange} 
                className="border-gray-300"
              />
            </div>
          </div>
        </div>

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

          {/* Formulario para nuevo seguro */}
          {showSeguroForm && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Nuevo Seguro Médico</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombreAseguradora" className="text-gray-700">Aseguradora *</Label>
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
                  <Label htmlFor="numeroPoliza" className="text-gray-700">Número Póliza *</Label>
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
                <Label htmlFor="cobertura" className="text-gray-700">Cobertura</Label>
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
                      cobertura: ""
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
                    'Guardar Seguro'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Selector de seguros existentes */}
          <div>
            <Label htmlFor="idSeguroMedico" className="text-gray-700">Seleccionar Seguro Existente</Label>
            <Select
              value={formData.idSeguroMedico}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, idSeguroMedico: value }))}
            >
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder={
                  loadingSeguros ? "Cargando seguros..." : 
                  segurosValidos.length === 0 ? "No hay seguros registrados" : 
                  "Seleccionar seguro"
                } />
              </SelectTrigger>
              <SelectContent>
                {segurosValidos.map((seguro, index) => {
                  console.log(`🔄 Mapeando seguro ${index}:`, seguro);
                  // Usar idSeguro en lugar de id
                  const seguroId = seguro.idSeguro.toString();
                  const seguroNombre = seguro.nombreAseguradora || 'Sin nombre';
                  const seguroPoliza = seguro.numeroPoliza || 'Sin póliza';
                  
                  console.log(`   📋 ID: ${seguroId}, Nombre: ${seguroNombre}, Póliza: ${seguroPoliza}`);
                  
                  return (
                    <SelectItem 
                      key={seguroId} 
                      value={seguroId}
                    >
                      {seguroNombre} - {seguroPoliza}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {segurosValidos.length === 0 && !loadingSeguros && (
              <p className="text-sm text-gray-500 mt-2">
                No hay seguros médicos registrados. Puede agregar uno nuevo.
              </p>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
            disabled={creandoSeguro}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            className="bg-gray-900 hover:bg-gray-800 text-white"
            disabled={creandoSeguro}
          >
            {initialData ? "Actualizar" : "Guardar Paciente"}
          </Button>
        </div>
      </form>
    </div>
  )
}