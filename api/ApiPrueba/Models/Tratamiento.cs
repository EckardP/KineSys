using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class Tratamiento
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Nombre { get; set; }
        public string Descripcion { get; set; }

        // Configuración de sesiones
        public int DuracionMinutos { get; set; } = 30;
        public int SesionesRecomendadas { get; set; } = 1;
        public string FrecuenciaRecomendada { get; set; } = "Semanal";

        // Información económica
        [Column(TypeName = "decimal(18,2)")]
        public decimal CostoBase { get; set; }

        // Información técnica
        public string MaterialesRequeridos { get; set; }
        public string Indicaciones { get; set; }
        public string Contraindicaciones { get; set; }

        // Estado y relación con especialidad
        public bool Activo { get; set; } = true;
        public int? IdEspecialidad { get; set; }

        // Relaciones
        [JsonIgnore]
        public PlanTratamiento? PlanTratamiento { get; set; }
        [JsonIgnore]
        public ICollection<Cita> Citas { get; set; } = new List<Cita>();
        [JsonIgnore]
        public ICollection<TratamientoProtocolo> TratamientoProtocolos { get; set; } = new List<TratamientoProtocolo>();
        [JsonIgnore]
        public ICollection<TratamientoTipoTerapia> TratamientoTipoTerapias { get; set; } = new List<TratamientoTipoTerapia>();
        public int? IdPaciente { get; set; }
        [JsonIgnore]
        [ForeignKey("IdPaciente")]
        public Paciente? Paciente { get; set; }
        public int? IdTerapeuta { get; set; }
        [JsonIgnore]
        [ForeignKey("IdTerapeuta")]
        public Terapeuta? Terapeuta { get; set; }
        [JsonIgnore]
        [ForeignKey("IdEspecialidad")]
        public Especialidad? Especialidad { get; set; }

        [JsonIgnore]
        public ICollection<TratamientoEquipo> TratamientoEquipos { get; set; } = new List<TratamientoEquipo>();

        // NOTA: He removido las relaciones con Paciente, Terapeuta, etc. que parecen ser para otro contexto
    }
}