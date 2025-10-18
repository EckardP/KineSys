namespace ApiPrueba.Models
{
    public class MensajeChat
    {
        public int Id { get; set; }
        public int IdRemitente { get; set; }
        public int IdDestinatario { get; set; }
        public string Contenido { get; set; }
        public DateTime FechaEnvio { get; set; }
    }
}
