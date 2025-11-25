using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class TipoServicioEspecialidad
    {
        [Key]
        public int IdTipoServicioEspecialidad { get; set; }

        [Required]
        public int IdTipoServicio { get; set; }

        [Required]
        public int IdEspecialidad { get; set; }

        public bool EsObligatoria { get; set; } = true;

        // Relaciones
        [ForeignKey("IdTipoServicio")]
        [JsonIgnore]
        public TipoServicio? TipoServicio { get; set; }

        [ForeignKey("IdEspecialidad")]
        [JsonIgnore]
        public Especialidad? Especialidad { get; set; }
    }
}
