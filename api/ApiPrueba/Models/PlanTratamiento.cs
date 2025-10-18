namespace ApiPrueba.Models
{
    public class PlanTratamiento
    {
        public int Id { get; set; }
        public string Objetivos { get; set; }
        public string DetallesSesiones { get; set; }
        public int DuracionDias { get; set; }
        public string Observaciones { get; set; }
        public int IdPaciente { get; set; }
        public Paciente Paciente { get; set; }

        public int IdTerapeuta { get; set; }
        public Terapeuta Terapeuta { get; set; }

        // Relación
        public int IdTratamiento { get; set; }
        public Tratamiento Tratamiento { get; set; }
    }
}
