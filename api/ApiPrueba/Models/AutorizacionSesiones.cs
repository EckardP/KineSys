using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class AutorizacionSesiones
    {
        [Key]
        public int IdAutorizacion { get; set; }

        [Required]
        public int IdPaciente { get; set; }

        public int? IdOrdenMedica { get; set; }

        [Required, StringLength(100)]
        public string NumeroAutorizacion { get; set; }

        [Required]
        public DateTime FechaAutorizacion { get; set; }

        [Required]
        public DateTime FechaVigenciaInicio { get; set; }

        [Required]
        public DateTime FechaVigenciaFin { get; set; }

        [Required]
        public int SesionesAprobadas { get; set; }

        public int SesionesConsumidas { get; set; } = 0;

        [Required, StringLength(50)]
        public string Estado { get; set; }

        [StringLength(300)]
        public string? RutaSoporte { get; set; }

        [StringLength(500)]
        public string? Observaciones { get; set; }

        // Relaciones
        [ForeignKey("IdPaciente")]
        [JsonIgnore]
        public Paciente? Paciente { get; set; }

        [ForeignKey("IdOrdenMedica")]
        [JsonIgnore]
        public OrdenMedica? OrdenMedica { get; set; }
    }
}
