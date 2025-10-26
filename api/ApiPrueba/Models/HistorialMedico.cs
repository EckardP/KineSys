using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class HistorialMedico
    {
        [Key]
        public int IdHistorial { get; set; }
        public int IdPaciente { get; set; }

        public string? Alergias { get; set; }

        public string? EnfermedadesCronicas { get; set; }

        public string? CirugiasAnteriores { get; set; }

        public string? MedicamentosActuales { get; set; }

        public string? AntecedentesHeredofamiliares { get; set; }

        public string? Habitos { get; set; }

        public string? ObservacionesGenerales { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        public DateTime? FechaActualizacion { get; set; }

        // Relación con Paciente
        [JsonIgnore]
        [ForeignKey("IdPaciente")]
        public Paciente? Paciente { get; set; }
    }
}
