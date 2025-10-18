namespace ApiPrueba.DTO
{
    public class PlanTratamientoDTO
    {
        public int Id { get; set; }
        public int PacienteId { get; set; }
        public string Paciente { get; set; }
        public int TerapeutaId { get; set; }
        public string Terapeuta { get; set; }

        public string Objetivos { get; set; }
        public string DetallesSesiones { get; set; }
        public int DuracionDias { get; set; }
        public string Observaciones { get; set; }
    }
}
