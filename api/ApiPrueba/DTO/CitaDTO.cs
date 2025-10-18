namespace ApiPrueba.DTO
{
    public class CitaDTO
    {
        public int Id { get; set; }
        public int PacienteId { get; set; }
        public string Paciente { get; set; } // nombre completo opcional
        public int TerapeutaId { get; set; }
        public string Terapeuta { get; set; } // nombre completo opcional
        public DateTime Fecha { get; set; }
        public string Estado { get; set; } // Programada, Completada, Cancelada
        public int? TratamientoId { get; set; }
        public string Notas { get; set; }
    }
}
