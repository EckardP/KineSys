namespace ApiPrueba.DTO
{
    public class TerapeutaDTO
    {
        public int Id { get; set; }
        public string NombreCompleto { get; set; }
        // Puede venir el id de la especialidad o el nombre (según el caso)
        public int? EspecialidadId { get; set; }
        public string Especialidad { get; set; }
        public string Telefono { get; set; }
        public string CorreoElectronico { get; set; }
    }
}