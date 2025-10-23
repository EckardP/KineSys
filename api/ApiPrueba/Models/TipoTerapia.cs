using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    /// <summary>
    /// Representa los diferentes tipos de terapias disponibles en la clínica.
    /// Ejemplos: Electroterapia, Masoterapia, Hidroterapia, Rehabilitación Post-operatoria, etc.
    /// </summary>
    public class TipoTerapia
    {
        [Key]
        public int IdTipoTerapia { get; set; }

        [Required, StringLength(100)]
        public string Nombre { get; set; }

        [StringLength(300)]
        public string Descripcion { get; set; }

        public bool Activo { get; set; } = true;

        // Relaciones N:N
        [JsonIgnore]
        public ICollection<TratamientoTipoTerapia> TratamientosTipoTerapia { get; set; } = new List<TratamientoTipoTerapia>();
        [JsonIgnore]
        public ICollection<ProtocoloTipoTerapia> ProtocolosTipoTerapia { get; set; } = new List<ProtocoloTipoTerapia>();
    }
}
