namespace ApiPrueba.Models
{
    public class Cita
    {
        public int Id { get; set; }
        public int DuracionProgramadaMin { get; set; }
        public DateTime? HoraInicioReal { get; set; }
        public DateTime? HoraFinReal { get; set; }
        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }
        public bool Confirmada { get; set; }

        // Relación con reserva y nota (opcional)
        public ReservaCita Reserva { get; set; }
        public NotaSesion NotaSesion { get; set; }

        // Relaciones
        public int IdPaciente { get; set; }
        public Paciente Paciente { get; set; }

        public int IdTerapeuta { get; set; }
        public Terapeuta Terapeuta { get; set; }

        public int? IdTratamiento { get; set; }
        public Tratamiento Tratamiento { get; set; }
    }
}
