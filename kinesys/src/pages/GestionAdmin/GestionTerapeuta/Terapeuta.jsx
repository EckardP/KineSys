import React, { useState, useEffect } from "react";
import "./Terapeuta.css";
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
    NoLicencia: "",
    TituloAcademico: "",
    AñosExperiencia: "",
    FechaContratacion: "",
    Id: "",
    Nombres: "",
    Apellidos: "",
    DocumentoIdentidad: "",
    Telefono: "",
    CorreoElectronico: "",
    FechaNacimiento: "",
    Genero: "",
    Direccion: "",
  });

  // 🔹 Cargar terapeutas al iniciar
  useEffect(() => {
    cargarTerapeutas();
  }, []);

const cargarTerapeutas = async () => {
  try {
    const data = await listarTerapeutas();
    const normalizados = (data || []).map(t => ({
      Id: t.id,
      Nombres: t.nombres,
      Apellidos: t.apellidos,
      DocumentoIdentidad: t.documentoIdentidad,
      Telefono: t.telefono,
      CorreoElectronico: t.correoElectronico,
      FechaNacimiento: t.fechaNacimiento,
      Genero: t.genero,
      Direccion: t.direccion,
      NoLicencia: t.noLicencia,
      TituloAcademico: t.tituloAcademico,
      AñosExperiencia: t.añosExperiencia,
      FechaContratacion: t.fechaContratacion,
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
        ...formData,
        AñosExperiencia: Number(formData.AñosExperiencia),
        FechaContratacion: formData.FechaContratacion || new Date().toISOString(),
        FechaNacimiento: formData.FechaNacimiento || new Date().toISOString(),
      };

      if (!datosTerapeuta.Id) delete datosTerapeuta.Id;

      if (modoEdicion) {
        await actualizarTerapeuta(datosTerapeuta.Id, datosTerapeuta);
      } else {
        await crearTerapeuta(datosTerapeuta);
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
      NoLicencia: "",
      TituloAcademico: "",
      AñosExperiencia: "",
      FechaContratacion: "",
      Id: "",
      Nombres: "",
      Apellidos: "",
      DocumentoIdentidad: "",
      Telefono: "",
      CorreoElectronico: "",
      FechaNacimiento: "",
      Genero: "",
      Direccion: "",
    });
    setModoEdicion(false);
  };

  // 🔹 Editar terapeuta
  const handleEdit = (terapeuta) => {
    setFormData({ ...terapeuta });
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
          <input
            type="text"
            name="Nombres"
            placeholder="Nombres"
            value={formData.Nombres}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="Apellidos"
            placeholder="Apellidos"
            value={formData.Apellidos}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="DocumentoIdentidad"
            placeholder="Documento de Identidad"
            value={formData.DocumentoIdentidad}
            onChange={handleChange}
          />
          <input
            type="text"
            name="Telefono"
            placeholder="Teléfono"
            value={formData.Telefono}
            onChange={handleChange}
          />
          <input
            type="email"
            name="CorreoElectronico"
            placeholder="Correo Electrónico"
            value={formData.CorreoElectronico}
            onChange={handleChange}
          />

          <div className="input-group">
            <label>Fecha de Nacimiento</label>
            <input
              type="date"
              name="FechaNacimiento"
              value={formData.FechaNacimiento}
              onChange={handleChange}
            />
          </div>

          <select name="Genero" value={formData.Genero} onChange={handleChange}>
            <option value="">Seleccionar Género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>

          <input
            type="text"
            name="Direccion"
            placeholder="Dirección"
            value={formData.Direccion}
            onChange={handleChange}
          />
          <input
            type="text"
            name="NoLicencia"
            placeholder="Número de Licencia"
            value={formData.NoLicencia}
            onChange={handleChange}
          />
          <input
            type="text"
            name="TituloAcademico"
            placeholder="Título Académico"
            value={formData.TituloAcademico}
            onChange={handleChange}
          />
          <input
            type="number"
            name="AñosExperiencia"
            placeholder="Años de Experiencia"
            value={formData.AñosExperiencia}
            onChange={handleChange}
          />

          <div className="input-group">
            <label>Fecha de Contratación</label>
            <input
              type="date"
              name="FechaContratacion"
              value={formData.FechaContratacion}
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
                    <td>{t.Nombres} {t.Apellidos}</td>
                    <td>{t.NoLicencia}</td>
                    <td>{t.TituloAcademico}</td>
                    <td>{t.AñosExperiencia} años</td>
                    <td>{t.Telefono}</td>
                    <td>{t.CorreoElectronico}</td>
                    <td>
                      <button
                        className="action-btn edit"
                        onClick={() => handleEdit(t)}
                      >
                        Editar
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(t.Id)}
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
