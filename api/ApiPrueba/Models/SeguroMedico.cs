namespace ApiPrueba.Models
{
    public class SeguroMedico
    {
        public int Id { get; set; }
        public string NombreAseguradora { get; set; }
        public string NumeroPoliza { get; set; }
        public string Cobertura { get; set; }

        public ICollection<Paciente> Pacientes { get; set; }
        public ICollection<Factura> Facturas { get; set; }
    }
}
