namespace ApiPrueba.DTO
{
    public class MensajeDTO
    {
        public int Id { get; set; }
        public int EmisorId { get; set; }
        public int ReceptorId { get; set; }
        public string Contenido { get; set; }
        public DateTime Fecha { get; set; }
    }
}
