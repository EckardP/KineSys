using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    /// <summary>
    /// Documentos asociados al historial clínico de un paciente (órdenes médicas, diagnósticos, imágenes).
    /// </summary>
    public class DocumentoPaciente
    {
        [Key]
        public int IdDocumento { get; set; }

        [Required]
        public int IdPaciente { get; set; }

        [Required]
        public TipoDocumentoEnum TipoDocumento { get; set; }

        [Required, StringLength(120)]
        public string NombreArchivo { get; set; }

        [Required, StringLength(200)]
        public string Ruta { get; set; }

        [StringLength(50)]
        public string? MimeType { get; set; }

        [Required]
        public long TamañoArchivo { get; set; } // En bytes

        public DateTime FechaSubida { get; set; }

        public int? IdUsuarioSubida { get; set; }

        [StringLength(300)]
        public string? Descripcion { get; set; }

        [JsonIgnore]
        [ForeignKey("IdPaciente")]
        public Paciente? Paciente { get; set; }
    }

   
    public enum TipoDocumentoEnum
    {
        OrdenMedica = 1,
        Diagnostico = 2,
        Imagen = 3,
        Laboratorio = 4,
        HistorialClinico = 5,
        Otro = 6
    }
}
