namespace ApiPrueba.DTO
{
    public class InventarioDTO
    {
        public int Id { get; set; }
        public int EquipoId { get; set; }
        public string EquipoNombre { get; set; }
        public int Cantidad { get; set; }
        public string Ubicacion { get; set; }
        public string Estado { get; set; }
    }
}
