namespace ApiPrueba.DTO
{
    public class PacienteDTO
    {
        public int Id { get; set; }
        public string NombreCompleto { get; set; }
        public DateTime? FechaNacimiento { get; set; }
        public string Genero { get; set; }
        public string Telefono { get; set; }
        public string CorreoElectronico { get; set; }
        public string Direccion { get; set; }
        public string HistorialMedico { get; set; }
        public int? IdSeguroMedico { get; set; }
    }
}
