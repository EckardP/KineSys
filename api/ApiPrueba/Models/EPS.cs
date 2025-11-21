namespace ApiPrueba.Models
{
    public class EPS
    {
        public int EPSId { get; set; }
        public string NombreEPS { get; set; }
        public int NumeroDeAfiliacion { get; set; }

        // Relaciones
        public ICollection<Paciente> Pacientes { get; set; } = new List<Paciente>();
    }
}
