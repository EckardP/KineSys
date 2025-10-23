using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class PlanTratamiento
    {
        public int Id { get; set; }
        public string Objetivos { get; set; }
        public string DetallesSesiones { get; set; }
        public int DuracionDias { get; set; }
        public string Observaciones { get; set; }
        [ForeignKey("Paciente")]
        public int IdPaciente { get; set; }
        [JsonIgnore]
        public Paciente? Paciente { get; set; }
        [ForeignKey("Terapeuta")]
        public int IdTerapeuta { get; set; }
        [JsonIgnore]
        public Terapeuta? Terapeuta { get; set; }

        // Relación
        [ForeignKey("Tratamiento")]
        public int IdTratamiento { get; set; }
        [JsonIgnore]
        public Tratamiento? Tratamiento { get; set; }
    }
}
