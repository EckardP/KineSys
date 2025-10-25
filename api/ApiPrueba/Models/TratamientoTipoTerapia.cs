using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    /// <summary>
    /// Tabla intermedia para la relación N:N entre Tratamiento y TipoTerapia.
    /// Un tratamiento puede incluir múltiples tipos de terapias.
    /// </summary>
    public class TratamientoTipoTerapia
    {
        [Key]
        public int IdTratamientoTipoTerapia { get; set; }

        [Required]
        public int IdTratamiento { get; set; }

        [ForeignKey("IdTratamiento")]
        [JsonIgnore]
        public Tratamiento? Tratamiento { get; set; }

        [Required]
        public int IdTipoTerapia { get; set; }

        [ForeignKey("IdTipoTerapia")]
        [JsonIgnore]
        public TipoTerapia? TipoTerapia { get; set; }

        public int NumeroSesionesAsignadas { get; set; }

        public int DuracionMinutosPorSesion { get; set; }

        [StringLength(200)]
        public string? Observaciones { get; set; }
    }
}
