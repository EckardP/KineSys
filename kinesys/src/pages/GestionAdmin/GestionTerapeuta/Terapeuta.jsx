import React, { useState, useEffect } from "react";
import "./Terapeuta.css";
import { registrarUsuario} from "../../../services/RegistrarService";
import {
  listarTerapeutas,
  crearTerapeuta,
  actualizarTerapeuta,
  eliminarTerapeuta,
} from "../../../services/terapeutasService"; 

export default function Terapeutas() {
  const [terapeutas, setTerapeutas] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState({
    user: "",
    password: "",
    nombres: "",
    apellidos: "",
    tipoDocumento: "",
    documentoIdentidad: "",
    telefono: "",
    correoElectronico: "",
    fechaNacimiento: "",
    genero: "",
    direccion: "",
    activo: true,
    fechaRegistro: new Date().toISOString(),
    rol: 2, // 1 = Terapeuta
    noLicencia: "",
    tituloAcademico: "",
    añosExperiencia: "",
    fechaContratacion: "",
  });

  // 🔹 Cargar terapeutas al iniciar
  useEffect(() => {
    cargarTerapeutas();
  }, []);

  const cargarTerapeutas = async () => {
    try {
      const data = await listarTerapeutas();
      const normalizados = (data || []).map(t => ({
        id: t.id,
        user: t.user,
        nombres: t.nombres,
        apellidos: t.apellidos,
        tipoDocumento: t.tipoDocumento,
        documentoIdentidad: t.documentoIdentidad,
        telefono: t.telefono,
        correoElectronico: t.correoElectronico,
        fechaNacimiento: t.fechaNacimiento,
        genero: t.genero,
        direccion: t.direccion,
        activo: t.activo,
        fechaRegistro: t.fechaRegistro,
        rol: t.rol,
        noLicencia: t.noLicencia,
        tituloAcademico: t.tituloAcademico,
        añosExperiencia: t.añosExperiencia,
        fechaContratacion: t.fechaContratacion,
      }));
      setTerapeutas(normalizados);
    } catch (error) {
      console.error("Error al listar terapeutas:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔹 Guardar o actualizar terapeuta
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const datosTerapeuta = {
        user: formData.user,
        password: formData.password,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        tipoDocumento: formData.tipoDocumento,
        documentoIdentidad: formData.documentoIdentidad,
        telefono: formData.telefono,
        correoElectronico: formData.correoElectronico,
        fechaNacimiento: formData.fechaNacimiento ? new Date(formData.fechaNacimiento).toISOString() : new Date().toISOString(),
        genero: formData.genero,
        direccion: formData.direccion,
        activo: true, // Siempre true al crear
        fechaRegistro: new Date().toISOString(),
        rol: 2, // Siempre 1 para Terapeuta
        noLicencia: formData.noLicencia,
        tituloAcademico: formData.tituloAcademico,
        añosExperiencia: Number(formData.añosExperiencia) || 0,
        fechaContratacion: formData.fechaContratacion ? new Date(formData.fechaContratacion).toISOString() : new Date().toISOString(),
      };

      if (modoEdicion && formData.id) {
        // Para actualizar, usa el ID y no envíes password ni campos de registro
        const { password, fechaRegistro, rol, ...datosActualizacion } = datosTerapeuta;
        await actualizarTerapeuta(formData.id, datosActualizacion);
      } else {
        // Para crear nuevo terapeuta
        await registrarUsuario(datosTerapeuta);
      }

      // 🔹 Recargar lista completa para mostrar tabla actualizada
      await cargarTerapeutas();
      limpiarFormulario();
    } catch (error) {
      console.error(error);
      alert(error.message || "Error al crear/actualizar terapeuta");
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      user: "",
      password: "",
      nombres: "",
      apellidos: "",
      tipoDocumento: "",
      documentoIdentidad: "",
      telefono: "",
      correoElectronico: "",
      fechaNacimiento: "",
      genero: "",
      direccion: "",
      activo: true,
      fechaRegistro: new Date().toISOString(),
      rol: 2,
      noLicencia: "",
      tituloAcademico: "",
      añosExperiencia: "",
      fechaContratacion: "",
    });
    setModoEdicion(false);
  };

  // 🔹 Editar terapeuta
  const handleEdit = (terapeuta) => {
    setFormData({ 
      ...terapeuta,
      fechaNacimiento: terapeuta.fechaNacimiento ? terapeuta.fechaNacimiento.split('T')[0] : "",
      fechaContratacion: terapeuta.fechaContratacion ? terapeuta.fechaContratacion.split('T')[0] : "",
      password: "" // No mostramos la password en edición por seguridad
    });
    setModoEdicion(true);
  };

  // 🔹 Eliminar terapeuta
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este terapeuta?")) {
      try {
        await eliminarTerapeuta(id);
        await cargarTerapeutas();
      } catch (error) {
        console.error("Error al eliminar terapeuta:", error);
        alert("Error al eliminar terapeuta");
      }
    }
  };

  return (
    <div className="terapeutas-container">
      <div className="header-section">
        <h1>Gestión de Terapeutas</h1>
        <p>Registra, visualiza o edita la información de los terapeutas activos.</p>
      </div>

      {/* --- FORMULARIO --- */}
      <div className="form-card">
        <h2>{modoEdicion ? "Editar Terapeuta" : "Registrar Terapeuta"}</h2>

        <form onSubmit={handleSubmit} className="terapeuta-form">
          {/* Campos de autenticación */}
          <input
            type="text"
            name="user"
            placeholder="Usuario"
            value={formData.user}
            onChange={handleChange}
            required
          />
          
          {!modoEdicion && (
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          )}

          {/* Información personal */}
          <input
            type="text"
            name="nombres"
            placeholder="Nombres"
            value={formData.nombres}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
          />

          <select name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange}>
            <option value="">Tipo de Documento</option>
            <option value="DNI">DNI</option>
            <option value="Cédula">Cédula</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>

          <input
            type="text"
            name="documentoIdentidad"
            placeholder="Documento de Identidad"
            value={formData.documentoIdentidad}
            onChange={handleChange}
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
          />
          <input
            type="email"
            name="correoElectronico"
            placeholder="Correo Electrónico"
            value={formData.correoElectronico}
            onChange={handleChange}
          />

          <div className="input-group">
            <label>Fecha de Nacimiento</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
            />
          </div>

          <select name="genero" value={formData.genero} onChange={handleChange}>
            <option value="">Seleccionar Género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
            <option value="Prefiero no decir">Prefiero no decir</option>
          </select>

          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={handleChange}
          />

          {/* Campos específicos del terapeuta */}
          <input
            type="text"
            name="noLicencia"
            placeholder="Número de Licencia"
            value={formData.noLicencia}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="tituloAcademico"
            placeholder="Título Académico"
            value={formData.tituloAcademico}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="añosExperiencia"
            placeholder="Años de Experiencia"
            value={formData.añosExperiencia}
            onChange={handleChange}
            min="0"
          />

          <div className="input-group">
            <label>Fecha de Contratación</label>
            <input
              type="date"
              name="fechaContratacion"
              value={formData.fechaContratacion}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-registrar">
              {modoEdicion ? "Actualizar" : "Registrar"}
            </button>
            {modoEdicion && (
              <button
                type="button"
                className="btn-cancelar"
                onClick={limpiarFormulario}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- TABLA --- */}
      <div className="table-card">
        <h2>Terapeutas Registrados</h2>

        {terapeutas.length === 0 ? (
          <p className="no-data">No hay terapeutas registrados.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Nombre</th>
                  <th>Licencia</th>
                  <th>Título</th>
                  <th>Experiencia</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {terapeutas.map((t, i) => (
                  <tr key={i}>
                    <td>{t.user}</td>
                    <td>{t.nombres} {t.apellidos}</td>
                    <td>{t.noLicencia}</td>
                    <td>{t.tituloAcademico}</td>
                    <td>{t.añosExperiencia} años</td>
                    <td>{t.telefono}</td>
                    <td>{t.correoElectronico}</td>
                    <td>
                      <button
                        className="action-btn edit"
                        onClick={() => handleEdit(t)}
                      >
                        Editar
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(t.id)}
                      >
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
  );
}