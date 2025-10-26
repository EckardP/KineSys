using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    /// <summary>
    /// Relación entre sesión/protocolo y los equipos o materiales necesarios.
    /// </summary>
    public class EquipoSesion
    {
        [Key]
        public int IdEquipoSesion { get; set; }

        public int? IdProtocolo { get; set; }

        public int IdEquipo { get; set; }

        public int CantidadUsada { get; set; }

        [StringLength(150)]
        public string Observaciones { get; set; }
        [JsonIgnore]
        [ForeignKey("IdProtocoloTratamiento")]
        public ProtocoloTratamiento? ProtocoloTratamiento { get; set; }
        [JsonIgnore]
        [ForeignKey("IdEquipo")]
        public Equipo? Equipo { get; set; }
    }
}
