using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class Tratamiento
    {
        [Key]
        public int Id { get; set; }
        public string NombreTratamiento { get; set; }
        public string Descripcion { get; set; }
        public int DuracionDias { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }

        // Relaciones
        [ForeignKey("Paciente")]
        public int IdPaciente { get; set; }
        [JsonIgnore]
        public Paciente? Paciente { get; set; }
        [ForeignKey("Terapeuta")]
        public int IdTerapeuta { get; set; }
        [JsonIgnore]
        public Terapeuta? Terapeuta { get; set; }
        [JsonIgnore]
        public PlanTratamiento? PlanTratamiento { get; set; }
        [JsonIgnore]
        public ICollection<Cita> Citas { get; set; } = new List<Cita>();
        [JsonIgnore]
        public ICollection<TratamientoProtocolo> TratamientoProtocolos { get; set; } = new List<TratamientoProtocolo>();
        [JsonIgnore]
        public ICollection<TratamientoTipoTerapia> TratamientoTipoTerapias { get; set; } = new List<TratamientoTipoTerapia>();
    }
}
