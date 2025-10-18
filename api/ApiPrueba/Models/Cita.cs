namespace ApiPrueba.Models
{
    public class Cita
    {
        public int Id { get; set; }
        public DateTime FechaCita { get; set; }
        public string HoraCita { get; set; }
        public string Estado { get; set; } // Programada, Completada, Cancelada

        // Relaciones
        public int IdPaciente { get; set; }
        public Paciente Paciente { get; set; }

        public int IdTerapeuta { get; set; }
        public Terapeuta Terapeuta { get; set; }

        public int? IdTratamiento { get; set; }
        public Tratamiento Tratamiento { get; set; }
    }
}
