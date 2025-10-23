using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    /// <summary>
    /// Tabla intermedia para la relación N:N entre Terapeuta y Especialidad.
    /// Un terapeuta puede tener múltiples especialidades.
    /// </summary>
    public class TerapeutaEspecialidad
    {
        [Key]
        public int IdTerapeutaEspecialidad { get; set; }

        [Required]
        public int IdTerapeuta { get; set; }

        [ForeignKey("IdTerapeuta")]
        [JsonIgnore]
        public Terapeuta? Terapeuta { get; set; }

        [Required]
        public int IdEspecialidad { get; set; }

        [ForeignKey("IdEspecialidad")]
        [JsonIgnore]
        public Especialidad? Especialidad { get; set; }

        public DateTime FechaCertificacion { get; set; }

        [StringLength(100)]
        public string? NumeroCertificado { get; set; }

        public bool EsPrincipal { get; set; } = false;
    }
}

