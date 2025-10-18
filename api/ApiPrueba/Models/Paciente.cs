namespace ApiPrueba.Models
{
    public class Paciente : Persona
    {
        public DateTime FechaNacimiento { get; set; }
        public string Genero { get; set; }
        public string Direccion { get; set; }
        public string HistorialMedico { get; set; }

        // Relaciones
        public int? IdSeguroMedico { get; set; }
        public SeguroMedico SeguroMedico { get; set; }

        public ICollection<Cita> Citas { get; set; }
        public ICollection<Tratamiento> Tratamientos { get; set; }
        public ICollection<Factura> Facturas { get; set; }
    }
}
