using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class TipoServicio
    {
        [Key]
        public int IdTipoServicio { get; set; }

        [Required, StringLength(150)]
        public string NombreServicio { get; set; }

        [StringLength(500)]
        public string? Descripcion { get; set; }

        [Required]
        public int DuracionEstandarMin { get; set; }

        [Required, StringLength(50)]
        public string TipoSalaNecesaria { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Precio { get; set; }

        public bool CompatibleConEPS { get; set; }

        public bool CompatibleConPrepagadas { get; set; }

        [StringLength(500)]
        public string? DocumentosNecesarios { get; set; }

        // Relaciones
        [JsonIgnore]
        public ICollection<EquiposRequeridos> EquiposRequeridos { get; set; } = new List<EquiposRequeridos>();

        [JsonIgnore]
        public ICollection<TipoServicioEspecialidad> TipoServicioEspecialidades { get; set; } = new List<TipoServicioEspecialidad>();
    }
}
