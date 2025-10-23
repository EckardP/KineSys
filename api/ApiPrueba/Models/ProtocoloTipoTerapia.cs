using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    /// <summary>
    /// Tabla intermedia para la relación N:N entre ProtocoloTratamiento y TipoTerapia.
    /// Un protocolo puede incluir múltiples tipos de terapias preconfiguradas.
    /// </summary>
    public class ProtocoloTipoTerapia
    {
        [Key]
        public int IdProtocoloTipoTerapia { get; set; }

        [Required]
        public int IdProtocolo { get; set; }

        [ForeignKey("IdProtocolo")]
        [JsonIgnore]
        public ProtocoloTratamiento ProtocoloTratamiento { get; set; }

        [Required]
        public int IdTipoTerapia { get; set; }

        [ForeignKey("IdTipoTerapia")]
        [JsonIgnore]
        public TipoTerapia TipoTerapia { get; set; }

        public int NumeroSesionesSugeridas { get; set; }

        public int DuracionMinutosSugerida { get; set; }

        public int OrdenSecuencia { get; set; }

        [StringLength(200)]
        public string? Instrucciones { get; set; }
    }
}

