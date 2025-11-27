using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class TratamientoEquipo
    {
        [Key]
        public int IdTratamientoEquipo { get; set; }

        public int IdTratamiento { get; set; }
        public int IdEquipo { get; set; }
        public int CantidadRequerida { get; set; } = 1;

        // Relaciones
        [JsonIgnore]
        [ForeignKey("IdTratamiento")]
        public Tratamiento Tratamiento { get; set; }

        [ForeignKey("IdEquipo")]
        public Equipo Equipo { get; set; }
    }
}