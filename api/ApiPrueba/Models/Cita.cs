using System.ComponentModel.DataAnnotations;
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
        public ReservaCita? Reserva { get; set; }
        public NotaSesion? NotaSesion { get; set; }

        // Relaciones
        public int IdPaciente { get; set; }
        [JsonIgnore]
        public Paciente Paciente { get; set; }

        public int IdTerapeuta { get; set; }
        [JsonIgnore]
        public Terapeuta Terapeuta { get; set; }

        public int? IdTratamiento { get; set; }
        [JsonIgnore]
        public Tratamiento? Tratamiento { get; set; }
        [JsonIgnore]
        public ICollection<AlertaAgenda> Alertas { get; set; } = new List<AlertaAgenda>();
        //public int IdAlertas { get; set; }
        //public AlertaAgenda Alertas { get; set; }

    }
}
