namespace ApiPrueba.DTOs
{
    /// <summary>
    /// DTO para crear una nueva factura
    /// </summary>
    public class CrearFacturaDTO
    {
        public string? NumeroFactura { get; set; }
        public int IdPaciente { get; set; }
        public int? IdTratamiento { get; set; }
        public DateTime FechaEmision { get; set; }
        public DateTime? FechaVencimiento { get; set; }
        public decimal Subtotal { get; set; }
        public decimal? Impuesto { get; set; }
        public decimal? Descuento { get; set; }
        public decimal Total { get; set; }
        public string? MetodoPago { get; set; }
        public string? Observaciones { get; set; }
        public int? IdUsuarioCreador { get; set; }
        public List<DetalleFacturaDTO>? Detalles { get; set; }
    }

    public class DetalleFacturaDTO
    {
        public string? Concepto { get; set; }
        public string? Descripcion { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
    }

    /// <summary>
    /// DTO para consultar facturas
    /// </summary>
    public class FacturaConsultaDTO
    {
        public int IdFactura { get; set; }
        public string? NumeroFactura { get; set; }
        public string? NombrePaciente { get; set; }
        public DateTime FechaEmision { get; set; }
        public DateTime? FechaVencimiento { get; set; }
        public decimal Total { get; set; }
        public string? Estado { get; set; }
        public string? MetodoPago { get; set; }
        public DateTime? FechaPago { get; set; }
        public string? RutaArchivoPDF { get; set; }
    }

    /// <summary>
    /// DTO para actualizar estado de factura
    /// </summary>
    public class ActualizarEstadoFacturaDTO
    {
        public int IdFactura { get; set; }
        public string? Estado { get; set; }
        public DateTime? FechaPago { get; set; }
        public string? MetodoPago { get; set; }
    }

    /// <summary>
    /// DTO para resumen de costos de citas o tratamientos
    /// </summary>
    public class ResumenCostosDTO
    {
        public int Cantidad { get; set; }
        public decimal Total { get; set; }
        public List<ItemCostoDTO> Items { get; set; } = new List<ItemCostoDTO>();
    }

    /// <summary>
    /// DTO para item individual de costo
    /// </summary>
    public class ItemCostoDTO
    {
        public int Id { get; set; }
        public string? Descripcion { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Precio { get; set; }
    }
}
