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

        public string? Estado { get; set; }

        // Relación con reserva y nota (opcional)
        //public ReservaCita? Reserva { get; set; }
        //public NotaSesion? NotaSesion { get; set; }

        // Relaciones
        [JsonPropertyName("pacienteId")]
        public int IdPaciente { get; set; }
        [ForeignKey("IdPaciente")]
        [JsonIgnore]
        public Paciente? Paciente { get; set; }

        [JsonPropertyName("terapeutaId")]
        public int IdTerapeuta { get; set; }
        [ForeignKey("IdTerapeuta")]
        [JsonIgnore]
        public Terapeuta? Terapeuta { get; set; }

        [JsonPropertyName("tratamientoId")]
        public int? IdTratamiento { get; set; }
        [ForeignKey("IdTratamiento")]
        [JsonIgnore]
        public Tratamiento? Tratamiento { get; set; }

        [JsonIgnore]
        public ICollection<AlertaAgenda> Alertas { get; set; } = new List<AlertaAgenda>();
    }
}
