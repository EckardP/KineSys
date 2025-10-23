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
        [ForeignKey("Paciente")]
        public int IdPaciente { get; set; }

        [Required, StringLength(50)]
        public string TipoDocumento { get; set; }

        [Required, StringLength(120)]
        public string NombreArchivo { get; set; }

        [Required, StringLength(200)]
        public string Ruta { get; set; }

        [StringLength(50)]
        public string? MimeType { get; set; }

        public DateTime FechaSubida { get; set; }

        [StringLength(80)]
        public string? SubidoPor { get; set; }
        [JsonIgnore]
        public Paciente? Paciente { get; set; }
    }
}
