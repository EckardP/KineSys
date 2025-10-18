namespace ApiPrueba.Models
{
    public class Inventario
    {
        public int Id { get; set; }
        public int Cantidad { get; set; }
        public string Ubicacion { get; set; }

        // Relación
        public int IdEquipo { get; set; }
        public Equipo Equipo { get; set; }
    }
}
