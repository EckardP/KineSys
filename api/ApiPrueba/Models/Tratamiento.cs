namespace ApiPrueba.Models
{
    public class Tratamiento
    {
        public int Id { get; set; }
        public string NombreTratamiento { get; set; }
        public string Descripcion { get; set; }
        public int DuracionDias { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }

        // Relaciones
        public int IdPaciente { get; set; }
        public Paciente Paciente { get; set; }

        public int IdTerapeuta { get; set; }
        public Terapeuta Terapeuta { get; set; }

        public PlanTratamiento? PlanTratamiento { get; set; }
    }
}
