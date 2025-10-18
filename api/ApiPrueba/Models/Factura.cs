namespace ApiPrueba.Models
{
    public class Factura
    {
        public int Id { get; set; }
        public DateTime FechaEmision { get; set; }
        public decimal MontoTotal { get; set; }
        public string MetodoPago { get; set; } // Efectivo, Tarjeta, Transferencia
        public string EstadoPago { get; set; } // Pagada, Pendiente, Cancelada

        // Relaciones
        public int IdPaciente { get; set; }
        public Paciente Paciente { get; set; }

        public int? IdSeguroMedico { get; set; }
        public SeguroMedico SeguroMedico { get; set; }
    }
}
