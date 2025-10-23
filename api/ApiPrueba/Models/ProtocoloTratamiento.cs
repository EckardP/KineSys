using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    /// <summary>
    /// Plantilla de tratamiento preconfigurada para condiciones comunes.
    /// </summary>
    public class ProtocoloTratamiento
    {
        [Key]
        public int IdProtocolo { get; set; }

        [Required, StringLength(80)]
        public string Nombre { get; set; }

        [StringLength(200)]
        public string Descripcion { get; set; }

        public int NumeroSesiones { get; set; }
        public bool Activo { get; set; }

        public int DuracionPorSesionMin { get; set; }

        [StringLength(300)]
        public string Recomendaciones { get; set; }

        // Relación con equipos necesarios
        [JsonIgnore]
        public ICollection<EquipoSesion> EquiposSesion { get; set; } = new List<EquipoSesion>();
        [JsonIgnore]
        public ICollection<TratamientoProtocolo> TratamientoProtocolos { get; set; } = new List<TratamientoProtocolo>();
        [JsonIgnore]
        public ICollection<ProtocoloTipoTerapia> ProtocoloTipoTerapias { get; set; } = new List<ProtocoloTipoTerapia>();
    }
}
