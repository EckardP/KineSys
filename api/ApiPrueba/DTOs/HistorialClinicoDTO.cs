using ApiPrueba.Models;
using System.Collections.Generic;

namespace ApiPrueba.DTOs
{
    /// <summary>
    /// DTO para consultar el historial clínico completo de un paciente
    /// </summary>
    public class HistorialClinicoCompletoDTO
    {
        public DatosPacienteDTO? DatosPaciente { get; set; }
        public HistorialMedicoDTO? HistorialMedico { get; set; }
        public List<DiagnosticoDTO>? Diagnosticos { get; set; }
        public List<TratamientoDTO>? Tratamientos { get; set; }
        public List<SesionDTO>? Sesiones { get; set; }
        public List<EvolucionDTO>? Evoluciones { get; set; }
        public List<DocumentoDTO>? Documentos { get; set; }
    }

    public class DatosPacienteDTO
    {
        public int Id { get; set; }
        public string? NombreCompleto { get; set; }
        public string? DocumentoIdentidad { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string? Genero { get; set; }
        public string? Telefono { get; set; }
        public string? CorreoElectronico { get; set; }
        public string? Direccion { get; set; }
        public string? SeguroMedico { get; set; }
        public string? RutaFotoPerfil { get; set; }
    }

    public class HistorialMedicoDTO
    {
        public string? Alergias { get; set; }
        public string? EnfermedadesCronicas { get; set; }
        public string? CirugiasAnteriores { get; set; }
        public string? MedicamentosActuales { get; set; }
        public string? AntecedentesHeredofamiliares { get; set; }
        public string? Habitos { get; set; }
        public string? ObservacionesGenerales { get; set; }
    }

    public class DiagnosticoDTO
    {
        public int IdDiagnostico { get; set; }
        public DateTime Fecha { get; set; }
        public string? DescripcionDiagnostico { get; set; }
        public string? TerapeutaResponsable { get; set; }
    }

    public class TratamientoDTO
    {
        public int IdTratamiento { get; set; }
        public string? Nombre { get; set; }
        public string? Descripcion { get; set; }
        public int DuracionMinutos { get; set; }
        public int SesionesRecomendadas { get; set; }
        public string? FrecuenciaRecomendada { get; set; }
        public decimal CostoBase { get; set; }
        public string? TipoTerapia { get; set; }
        public string? TerapeutaAsignado { get; set; }
        public bool Activo { get; set; }
    }

    public class SesionDTO
    {
        public int IdNota { get; set; }
        public DateTime FechaSesion { get; set; }
        public string? TerapeutaNombre { get; set; }
        public string? NotaEvolucion { get; set; }
        public string? ObjetivosLogrados { get; set; }
    }

    public class EvolucionDTO
    {
        public int IdEvolucion { get; set; }
        public DateTime Fecha { get; set; }
        public string? Indicador { get; set; }
        public decimal Valor { get; set; }
    }

    public class DocumentoDTO
    {
        public int IdDocumento { get; set; }
        public string? TipoDocumento { get; set; }
        public string? NombreArchivo { get; set; }
        public string? Ruta { get; set; }
        public DateTime FechaSubida { get; set; }
        public string? SubidoPor { get; set; }
        public string? Descripcion { get; set; }
        public long TamañoArchivo { get; set; }
    }

    /// <summary>
    /// DTO para solicitud de exportación de historial clínico
    /// </summary>
    public class ExportarHistorialDTO
    {
        public int IdPaciente { get; set; }
        public DateTime? FechaDesde { get; set; }
        public DateTime? FechaHasta { get; set; }
        public bool IncluirDocumentos { get; set; } = true;
        public bool IncluirImagenes { get; set; } = true;
        public string? LogoClinica { get; set; } // Ruta al logo
        public string? NombreClinica { get; set; }
    }

    /// <summary>
    /// DTO para subir documentos del paciente
    /// </summary>
    public class SubirDocumentoDTO
    {
        public int IdPaciente { get; set; }
        public TipoDocumentoEnum TipoDocumento { get; set; }
        public string? Descripcion { get; set; }
        public int IdUsuarioSubida { get; set; }
    }

    /// <summary>
    /// DTO para verificar permisos de acceso al historial
    /// </summary>
    public class VerificarAccesoHistorialDTO
    {
        public int IdUsuario { get; set; }
        public Rol RolUsuario { get; set; }
        public int IdPaciente { get; set; }
    }
}
