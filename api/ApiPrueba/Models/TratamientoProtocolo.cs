using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    /// <summary>
    /// Tabla intermedia para la relación N:N entre Tratamiento y ProtocoloTratamiento.
    /// Un tratamiento puede usar múltiples protocolos preconfigurados.
    /// </summary>
    public class TratamientoProtocolo
    {
        [Key]
        public int IdTratamientoProtocolo { get; set; }

        [Required]
        public int IdTratamiento { get; set; }

        [ForeignKey("IdTratamiento")]
        [JsonIgnore]
        public Tratamiento? Tratamiento { get; set; }

        [Required]
        public int IdProtocolo { get; set; }

        [ForeignKey("IdProtocolo")]
        [JsonIgnore]
        public ProtocoloTratamiento? ProtocoloTratamiento { get; set; }

        public DateTime FechaAsignacion { get; set; }

        public int OrdenAplicacion { get; set; }

        [StringLength(200)]
        public string? NotasAplicacion { get; set; }
    }
}
