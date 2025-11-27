// src/pages/GestionCita/CitaTherapistSelection.jsx
"use client"

import { useState, useEffect } from "react"
import { Search, User, Mail, Phone, Award, ArrowRight, ArrowLeft, Filter, AlertCircle } from "lucide-react"
import { listarTerapeutas, obtenerTerapeuta } from "../../../services/terapeutasService"
import { obtenerEspecialidadesPorTipoServicio } from "../../../services/tipoServicioEspecialidadesService"
import { obtenerEspecialidadesPorTerapeuta } from "../../../services/terapeutaEspecialidadesService"

export default function CitaTherapistSelection({ citaData, updateCitaData, onNext, onBack }) {
  const [terapeutas, setTerapeutas] = useState([])
  const [terapeutasFiltrados, setTerapeutasFiltrados] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false)
  const [selectedTerapeuta, setSelectedTerapeuta] = useState(null)
  const [terapeutaDetalle, setTerapeutaDetalle] = useState(null)
  const [especialidadesRequeridas, setEspecialidadesRequeridas] = useState([])
  const [especialidadesTerapeutas, setEspecialidadesTerapeutas] = useState({})
  const [filtroActivo, setFiltroActivo] = useState(false)
  const [especialidadesCargadas, setEspecialidadesCargadas] = useState(false)

  useEffect(() => {
    cargarDatos()
  }, [citaData.idTipoServicio])

  // NUEVO: useEffect para aplicar automáticamente el filtro cuando las especialidades estén cargadas
  useEffect(() => {
    if (especialidadesCargadas && filtroActivo && especialidadesRequeridas.length > 0) {
      console.log("🔄 Aplicando filtro automáticamente...")
      aplicarFiltroEspecialidad(terapeutas, especialidadesRequeridas)
    }
  }, [especialidadesCargadas, filtroActivo, especialidadesRequeridas, terapeutas])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      
      // 1. Cargar terapeutas
      const terapeutasData = await listarTerapeutas()
      setTerapeutas(terapeutasData || [])
      setTerapeutasFiltrados(terapeutasData || [])
      
      // 2. Cargar especialidades para TODOS los terapeutas inmediatamente
      await cargarEspecialidadesParaTodosLosTerapeutas(terapeutasData || [])
      
      // 3. Cargar especialidades requeridas para el servicio
      if (citaData.idTipoServicio) {
        await cargarEspecialidadesRequeridas(citaData.idTipoServicio)
      } else {
        setEspecialidadesRequeridas([])
      }
      
    } catch (error) {
      console.error("Error al cargar datos:", error)
      setTerapeutas([])
      setTerapeutasFiltrados([])
      setEspecialidadesRequeridas([])
    } finally {
      setLoading(false)
    }
  }

  const cargarEspecialidadesParaTodosLosTerapeutas = async (listaTerapeutas) => {
    if (!listaTerapeutas || listaTerapeutas.length === 0) {
      setEspecialidadesCargadas(true)
      return
    }

    const nuevasEspecialidades = { ...especialidadesTerapeutas };
    let cambios = false;

    console.log(`🔄 Cargando especialidades para ${listaTerapeutas.length} terapeutas...`);

    // Usar Promise.all para cargar todas las especialidades en paralelo
    const promesasEspecialidades = listaTerapeutas.map(async (terapeuta) => {
      if (!nuevasEspecialidades[terapeuta.id]) {
        try {
          const especialidades = await obtenerEspecialidadesPorTerapeuta(terapeuta.id);
          nuevasEspecialidades[terapeuta.id] = especialidades;
          cambios = true;
          console.log(`✅ Terapeuta ${terapeuta.id}: ${especialidades.length} especialidades cargadas`);
        } catch (error) {
          console.error(`Error al cargar especialidades del terapeuta ${terapeuta.id}:`, error);
          nuevasEspecialidades[terapeuta.id] = [];
          cambios = true;
        }
      }
    });

    // Esperar a que TODAS las especialidades se carguen
    await Promise.all(promesasEspecialidades);

    if (cambios) {
      setEspecialidadesTerapeutas(nuevasEspecialidades);
    }
    
    setEspecialidadesCargadas(true);
    console.log("🎉 Todas las especialidades han sido cargadas");
  }

  const cargarEspecialidadesRequeridas = async (idTipoServicio) => {
    try {
      setLoadingEspecialidades(true)
      const especialidades = await obtenerEspecialidadesPorTipoServicio(idTipoServicio)
      setEspecialidadesRequeridas(especialidades || [])
      
      // Activar el filtro automáticamente si hay especialidades requeridas
      if (especialidades && especialidades.length > 0) {
        setFiltroActivo(true)
        console.log("✅ Filtro activado automáticamente por especialidades requeridas");
      } else {
        setFiltroActivo(false)
        setTerapeutasFiltrados(terapeutas)
      }
      
    } catch (error) {
      console.error("Error al cargar especialidades requeridas:", error)
      setEspecialidadesRequeridas([])
      setFiltroActivo(false)
      setTerapeutasFiltrados(terapeutas)
    } finally {
      setLoadingEspecialidades(false)
    }
  }

  // Función de filtro síncrono
  const aplicarFiltroEspecialidad = (listaTerapeutas, especialidadesReq) => {
    if (!especialidadesReq || especialidadesReq.length === 0) {
      setTerapeutasFiltrados(listaTerapeutas)
      return
    }

    const idsEspecialidadesRequeridas = especialidadesReq.map(esp => esp.idEspecialidad)
    console.log("🔄 Aplicando filtro con IDs de especialidades requeridas:", idsEspecialidadesRequeridas)
    console.log("📊 Estado actual de especialidadesTerapeutas:", especialidadesTerapeutas)
    
    const terapeutasCompatibles = []
    
    for (const terapeuta of listaTerapeutas) {
      const especialidadesTerapeuta = especialidadesTerapeutas[terapeuta.id] || [];
      
      console.log(`🔍 Verificando terapeuta ${terapeuta.id}:`, {
        tieneEspecialidades: especialidadesTerapeuta.length > 0,
        especialidades: especialidadesTerapeuta,
        idsEncontrados: especialidadesTerapeuta.map(esp => esp.idEspecialidad),
        idsRequeridos: idsEspecialidadesRequeridas
      })
      
      const tieneEspecialidadRequerida = especialidadesTerapeuta.some(espTer => {
        return idsEspecialidadesRequeridas.includes(espTer.idEspecialidad)
      })
      
      console.log(`✅ Terapeuta ${terapeuta.id} tiene especialidad requerida:`, tieneEspecialidadRequerida)
      
      if (tieneEspecialidadRequerida) {
        terapeutasCompatibles.push(terapeuta)
      }
    }
    
    console.log("🎯 Terapeutas compatibles encontrados:", terapeutasCompatibles.length)
    setTerapeutasFiltrados(terapeutasCompatibles)
  }

  const toggleFiltroEspecialidad = () => {
    if (filtroActivo) {
      setFiltroActivo(false)
      setTerapeutasFiltrados(terapeutas)
      console.log("❌ Filtro desactivado - mostrando todos los terapeutas");
    } else {
      setFiltroActivo(true)
      // El useEffect se encargará de aplicar el filtro automáticamente
      console.log("✅ Filtro activado - aplicando filtro automáticamente");
    }
  }

  const cargarDetalleTerapeuta = async (idTerapeuta) => {
    try {
      const detalle = await obtenerTerapeuta(idTerapeuta)
      setTerapeutaDetalle(detalle)
    } catch (error) {
      console.error("Error al cargar detalle del terapeuta:", error)
    }
  }

  const cargarEspecialidadesTerapeuta = async (idTerapeuta) => {
    try {
      const especialidades = await obtenerEspecialidadesPorTerapeuta(idTerapeuta)
      setEspecialidadesTerapeutas(prev => ({
        ...prev,
        [idTerapeuta]: especialidades
      }))
    } catch (error) {
      console.error(`Error al cargar especialidades del terapeuta ${idTerapeuta}:`, error)
      setEspecialidadesTerapeutas(prev => ({
        ...prev,
        [idTerapeuta]: []
      }))
    }
  }

  useEffect(() => {
    if (selectedTerapeuta) {
      cargarDetalleTerapeuta(selectedTerapeuta.id)
      
      // Asegurarse de que las especialidades del terapeuta seleccionado estén cargadas
      if (!especialidadesTerapeutas[selectedTerapeuta.id]) {
        cargarEspecialidadesTerapeuta(selectedTerapeuta.id)
      }
    }
  }, [selectedTerapeuta])

  const terapeutasParaMostrar = terapeutasFiltrados.filter(terapeuta =>
    terapeuta.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    terapeuta.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    terapeuta.documentoIdentidad?.includes(searchTerm) ||
    terapeuta.tituloAcademico?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectTerapeuta = (terapeuta) => {
    setSelectedTerapeuta(terapeuta)
    updateCitaData({
      idTerapeuta: terapeuta.id
    })
  }

  const handleContinue = () => {
    if (!selectedTerapeuta) {
      alert("Por favor selecciona un terapeuta")
      return
    }
    onNext()
  }

  const obtenerEspecialidadesDelTerapeuta = (idTerapeuta) => {
    return especialidadesTerapeutas[idTerapeuta] || []
  }

  const obtenerNombresEspecialidades = (especialidades) => {
    if (!especialidades || especialidades.length === 0) return "Sin especialidades"
    
    return especialidades.map(esp => {
      return esp.nombre || `Especialidad ${esp.idEspecialidad}`;
    }).join(", ")
  }

  const obtenerNombreEspecialidad = (idEspecialidad) => {
    // Buscar en todas las especialidades cargadas de todos los terapeutas
    for (const terapeutaId in especialidadesTerapeutas) {
      const especialidades = especialidadesTerapeutas[terapeutaId];
      const especialidadEncontrada = especialidades.find(esp => esp.idEspecialidad === idEspecialidad);
      if (especialidadEncontrada && especialidadEncontrada.nombre) {
        return especialidadEncontrada.nombre;
      }
    }
    
    return `Especialidad ${idEspecialidad}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Paso 3: Selecciona el terapeuta
        </h3>
        <p className="text-gray-600">
          {especialidadesRequeridas.length > 0 
            ? `Terapeutas con especialidades requeridas para el servicio`
            : "Elige el terapeuta que atenderá la cita"
          }
        </p>
      </div>

      {especialidadesRequeridas.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Filter className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">
                Especialidades requeridas para este servicio
              </h4>
              <div className="flex flex-wrap gap-2">
                {especialidadesRequeridas.map((espReq, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {obtenerNombreEspecialidad(espReq.idEspecialidad)}
                    {espReq.esObligatoria && (
                      <span className="ml-1 text-xs">(Obligatoria)</span>
                    )}
                  </span>
                ))}
              </div>
              <p className="text-blue-700 text-sm mt-2">
                Se muestran solo terapeutas que tienen al menos una de estas especialidades.
                {filtroActivo && (
                  <button
                    onClick={toggleFiltroEspecialidad}
                    className="ml-2 underline hover:text-blue-900"
                  >
                    Ver todos los terapeutas
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {especialidadesRequeridas.length === 0 && citaData.idTipoServicio && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">
                Sin especialidades requeridas
              </h4>
              <p className="text-yellow-700 text-sm">
                Este servicio no tiene especialidades específicas requeridas. 
                Se muestran todos los terapeutas disponibles.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar terapeuta por nombre, apellido, documento o título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          {especialidadesRequeridas.length > 0 && (
            <button
              onClick={toggleFiltroEspecialidad}
              className={`
                px-4 py-3 border rounded-lg flex items-center gap-2 transition-colors
                ${filtroActivo
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Filter size={18} />
              {filtroActivo ? 'Filtro Activo' : 'Sin Filtro'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">
              {filtroActivo ? 'Terapeutas compatibles' : 'Todos los terapeutas'}
            </h4>
            <span className="text-sm text-gray-500">
              {terapeutasParaMostrar.length} de {terapeutas.length} terapeutas
            </span>
          </div>
          
          {loading || loadingEspecialidades ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">
                {loadingEspecialidades ? 'Cargando especialidades...' : 'Cargando terapeutas...'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {terapeutasParaMostrar.map((terapeuta) => {
                const especialidadesTerapeuta = obtenerEspecialidadesDelTerapeuta(terapeuta.id)
                const tieneEspecialidades = especialidadesTerapeuta.length > 0
                
                return (
                  <div
                    key={terapeuta.id}
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${selectedTerapeuta?.id === terapeuta.id
                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => handleSelectTerapeuta(terapeuta)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900">
                              {terapeuta.nombres} {terapeuta.apellidos}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {terapeuta.tipoDocumento}: {terapeuta.documentoIdentidad}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {terapeuta.tituloAcademico && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Award size={14} />
                              <span>{terapeuta.tituloAcademico}</span>
                            </div>
                          )}
                          
                          {tieneEspecialidades && (
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">Especialidades: </span>
                              <span className="text-gray-600">
                                {obtenerNombresEspecialidades(especialidadesTerapeuta)}
                              </span>
                            </div>
                          )}
                          
                          {!tieneEspecialidades && (
                            <div className="text-sm text-yellow-600">
                              <span className="font-medium">Sin especialidades registradas</span>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {terapeuta.telefono && (
                              <div className="flex items-center gap-1">
                                <Phone size={14} />
                                <span>{terapeuta.telefono}</span>
                              </div>
                            )}
                            {terapeuta.correoElectronico && (
                              <div className="flex items-center gap-1">
                                <Mail size={14} />
                                <span className="truncate">{terapeuta.correoElectronico}</span>
                              </div>
                            )}
                          </div>

                          {terapeuta.añosExperiencia > 0 && (
                            <div className="text-sm text-gray-600">
                              <strong>Experiencia:</strong> {terapeuta.añosExperiencia} años
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {selectedTerapeuta?.id === terapeuta.id && (
                        <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {!loading && !loadingEspecialidades && terapeutasParaMostrar.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p>
                {filtroActivo 
                  ? "No se encontraron terapeutas con las especialidades requeridas."
                  : "No se encontraron terapeutas que coincidan con la búsqueda."
                }
              </p>
              {filtroActivo && (
                <button
                  onClick={toggleFiltroEspecialidad}
                  className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  Ver todos los terapeutas
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-4">Información del terapeuta</h4>
          
          {selectedTerapeuta && terapeutaDetalle ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-lg text-gray-900">
                    {terapeutaDetalle.nombres} {terapeutaDetalle.apellidos}
                  </h5>
                  <p className="text-gray-600">
                    {terapeutaDetalle.tipoDocumento}: {terapeutaDetalle.documentoIdentidad}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-700">Licencia</label>
                    <p className="text-gray-900">{terapeutaDetalle.noLicencia || "No especificada"}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Título Académico</label>
                    <p className="text-gray-900">{terapeutaDetalle.tituloAcademico || "No especificado"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-700">Experiencia</label>
                    <p className="text-gray-900">{terapeutaDetalle.añosExperiencia || 0} años</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Fecha de Contratación</label>
                    <p className="text-gray-900">
                      {terapeutaDetalle.fechaContratacion 
                        ? new Date(terapeutaDetalle.fechaContratacion).toLocaleDateString()
                        : "No especificada"
                      }
                    </p>
                  </div>
                </div>

                {especialidadesTerapeutas[selectedTerapeuta.id] && 
                 especialidadesTerapeutas[selectedTerapeuta.id].length > 0 && (
                  <div>
                    <label className="font-medium text-gray-700">Especialidades</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {especialidadesTerapeutas[selectedTerapeuta.id].map((esp, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {esp.nombre || `Especialidad ${esp.idEspecialidad}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-medium text-gray-700">Contacto</label>
                  <div className="space-y-2 mt-1">
                    {terapeutaDetalle.telefono && (
                      <div className="flex items-center gap-2 text-gray-900">
                        <Phone size={16} />
                        <span>{terapeutaDetalle.telefono}</span>
                      </div>
                    )}
                    {terapeutaDetalle.celular && (
                      <div className="flex items-center gap-2 text-gray-900">
                        <Phone size={16} />
                        <span>{terapeutaDetalle.celular}</span>
                      </div>
                    )}
                    {terapeutaDetalle.correoElectronico && (
                      <div className="flex items-center gap-2 text-gray-900">
                        <Mail size={16} />
                        <span>{terapeutaDetalle.correoElectronico}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                  <label className="font-medium text-green-900">Información Profesional</label>
                  <div className="space-y-1 mt-1 text-sm">
                    <p><strong>Licencia:</strong> {terapeutaDetalle.noLicencia || "No especificada"}</p>
                    <p><strong>Título:</strong> {terapeutaDetalle.tituloAcademico || "No especificado"}</p>
                    <p><strong>Experiencia:</strong> {terapeutaDetalle.añosExperiencia || 0} años</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Selecciona un terapeuta para ver su información</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Volver
        </button>
        
        {selectedTerapeuta && (
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            Continuar
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  )
}