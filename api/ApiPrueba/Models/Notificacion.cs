namespace ApiPrueba.Models
{
    public class Notificacion
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Mensaje { get; set; }
        public DateTime FechaEnvio { get; set; }
        public bool Leida { get; set; }

        public int? IdPaciente { get; set; }
        public int? IdTerapeuta { get; set; }
    }
}
