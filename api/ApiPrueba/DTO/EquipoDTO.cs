namespace ApiPrueba.DTO
{
    public class EquipoDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Estado { get; set; } // Disponible, En Mantenimiento, Dañado
        public int Cantidad { get; set; }
        public string Ubicacion { get; set; }
    }
}
