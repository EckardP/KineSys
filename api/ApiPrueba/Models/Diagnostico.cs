using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class Diagnostico
    {
        [Key]
        public int IdDiagnostico { get; set; }

        [Required]
        public string? Descripcion { get; set; }

        public string? Observaciones { get; set; }

        public DateTime FechaDiagnostico { get; set; } = DateTime.UtcNow;

        [Required]
        public int IdPaciente { get; set; }
        [ForeignKey("IdPaciente")]
        [JsonIgnore]
        public Paciente? Paciente { get; set; }

        [Required]
        public int IdTerapeuta { get; set; }
        [ForeignKey("IdTerapeuta")]
        [JsonIgnore]
        public Terapeuta? Terapeuta { get; set; }

        public int? IdTratamiento { get; set; }
        [ForeignKey("IdTratamiento")]
        [JsonIgnore]
        public Tratamiento? Tratamiento { get; set; }
    }
}
