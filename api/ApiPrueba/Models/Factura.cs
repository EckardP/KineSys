using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    /// <summary>
    /// Registro de facturas asociadas a pacientes y tratamientos
    /// </summary>
    public class Factura
    {
        [Key]
        public int IdFactura { get; set; }

        [Required, StringLength(50)]
        public string NumeroFactura { get; set; }

        [Required]
        public int IdPaciente { get; set; }

        public int? IdTratamiento { get; set; }

        [Required]
        public DateTime FechaEmision { get; set; }

        public DateTime? FechaVencimiento { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Impuesto { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Descuento { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }

        [Required, StringLength(50)]
        public string Estado { get; set; }

        [StringLength(50)]
        public string? MetodoPago { get; set; }

        public DateTime? FechaPago { get; set; }

        [StringLength(200)]
        public string? RutaArchivoPDF { get; set; }

        [StringLength(500)]
        public string? Observaciones { get; set; }

        public int? IdUsuarioCreador { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        // Relaciones
        [JsonIgnore]
        [ForeignKey("IdPaciente")]
        public Paciente? Paciente { get; set; }

        [JsonIgnore]
        [ForeignKey("IdTratamiento")]
        public Tratamiento? Tratamiento { get; set; }

        [JsonIgnore]
        public ICollection<DetalleFactura> Detalles { get; set; } = new List<DetalleFactura>();
    }


    public class DetalleFactura
    {
        [Key]
        public int IdDetalle { get; set; }

        [Required]
        public int IdFactura { get; set; }

        [Required, StringLength(200)]
        public string Concepto { get; set; }

        [StringLength(500)]
        public string? Descripcion { get; set; }

        [Required]
        public int Cantidad { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioUnitario { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        // Relación
        [JsonIgnore]
        [ForeignKey("IdFactura")]
        public Factura? Factura { get; set; }
    }
}
        


