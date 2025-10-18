namespace ApiPrueba.DTO
{
    public class FacturaDTO
    {
        public int Id { get; set; }
        public int PacienteId { get; set; }
        public string Paciente { get; set; }
        public int? SeguroMedicoId { get; set; }

        public DateTime FechaEmision { get; set; }
        public decimal MontoTotal { get; set; }
        public string MetodoPago { get; set; } // Efectivo, Tarjeta, Transferencia
        public string EstadoPago { get; set; } // Pagada, Pendiente, Cancelada
        public string Detalles { get; set; }
    }
}
