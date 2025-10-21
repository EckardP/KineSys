namespace ApiPrueba.Models
{
    public class Equipo
    {
        public int Id { get; set; }
        public string NombreEquipo { get; set; }
        public string Descripcion { get; set; }
        public string Estado { get; set; } // Disponible, En Mantenimiento, Dañado
        public int Cantidad { get; set; }
        public string Ubicacion { get; set; }

        // Relación con inventario
        //public Inventario Inventario { get; set; }
    }
}
