using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class EPS
    {
        public int EPSId { get; set; }
        public string NombreEPS { get; set; }

        // Relaciones
        [JsonIgnore]
        public ICollection<Paciente> Pacientes { get; set; } = new List<Paciente>();
    }
}
