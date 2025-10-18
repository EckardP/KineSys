namespace ApiPrueba.DTO
{
    public class NotificacionDTO
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Mensaje { get; set; }
        public DateTime Fecha { get; set; }
        public bool EsLeida { get; set; }
        public int? PacienteId { get; set; }
        public int? TerapeutaId { get; set; }
    }
}
