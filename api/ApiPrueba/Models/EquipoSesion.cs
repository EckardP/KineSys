using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ApiPrueba.Models
{
    /// <summary>
    /// Relación entre sesión/protocolo y los equipos o materiales necesarios.
    /// </summary>
    public class EquipoSesion
    {
        [Key]
        public int IdEquipoSesion { get; set; }

        [ForeignKey("ProtocoloTratamiento")]
        public int? IdProtocolo { get; set; }

        [ForeignKey("Equipo")]
        public int IdEquipo { get; set; }

        public int CantidadUsada { get; set; }

        [StringLength(150)]
        public string Observaciones { get; set; }

        public ProtocoloTratamiento ProtocoloTratamiento { get; set; }
        public Equipo Equipo { get; set; }
    }
}
