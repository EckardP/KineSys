   using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class Cita
    {
        [Key]
        public int IdCita { get; set; }
        public int DuracionProgramadaMin { get; set; }
        public DateTime? HoraInicioReal { get; set; }
        public DateTime? HoraFinReal { get; set; }
        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }
        public bool Confirmada { get; set; }

        public string? Motivo { get; set; }

        public string? Estado { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? PrecioCita { get; set; }

        /// Tipo de atención: EPS, Particular, Prepagada
        [StringLength(50)]
        public string? TipoAtencion { get; set; }
        public int? IdEPS { get; set; }

        /// Valor del copago si aplica
        [Column(TypeName = "decimal(18,2)")]
        public decimal? Copago { get; set; }
        public int? IdAutorizacion { get; set; }
        public int? IdOrdenMedica { get; set; }
        public int? IdSala { get; set; }
        public int? IdTipoServicio { get; set; }

        // Relaciones

        public int IdPaciente { get; set; }
        [ForeignKey("IdPaciente")]
        [JsonIgnore]
        public Paciente? Paciente { get; set; }

        
        public int IdTerapeuta { get; set; }
        [ForeignKey("IdTerapeuta")]
        [JsonIgnore]
        public Terapeuta? Terapeuta { get; set; }

        
        public int? IdTratamiento { get; set; }
        [ForeignKey("IdTratamiento")]
        [JsonIgnore]
        public Tratamiento? Tratamiento { get; set; }

        [JsonIgnore]
        public ICollection<AlertaAgenda> Alertas { get; set; } = new List<AlertaAgenda>();
    }
}
