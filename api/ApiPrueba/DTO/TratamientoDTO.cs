namespace ApiPrueba.DTO
{
    public class TratamientoDTO
    {
        public int Id { get; set; }
        public string NombreTratamiento { get; set; }
        public string Descripcion { get; set; }
        public int DuracionDias { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }

        public int PacienteId { get; set; }
        public string Paciente { get; set; }
        public int TerapeutaId { get; set; }
        public string Terapeuta { get; set; }

        public int? PlanTratamientoId { get; set; }
    }
}
