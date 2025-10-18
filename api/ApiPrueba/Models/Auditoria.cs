namespace ApiPrueba.Models
{
    public class Auditoria
    {
        public int Id { get; set; }
        public string Usuario { get; set; }
        public string Accion { get; set; }
        public string Entidad { get; set; }
        public DateTime FechaAccion { get; set; }
        public string Detalle { get; set; }
    }
}
