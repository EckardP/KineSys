using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class EquiposRequeridos
    {
        [Key]
        public int IdEquipoRequerido { get; set; }

        [Required]
        public int IdTipoServicio { get; set; }

        [Required]
        public int IdEquipo { get; set; }
        public int CantidadRequerida { get; set; } = 1;
        public bool EsObligatorio { get; set; } = true;

        // Relaciones
        [ForeignKey("IdTipoServicio")]
        [JsonIgnore]
        public TipoServicio? TipoServicio { get; set; }

        [ForeignKey("IdEquipo")]
        [JsonIgnore]
        public Equipo? Equipo { get; set; }
    }
}
       