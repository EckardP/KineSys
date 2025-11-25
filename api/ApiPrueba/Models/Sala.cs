using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class Sala
    {
        [Key]
        public int IdSala { get; set; }

        [Required, StringLength(100)]
        public string Nombre { get; set; }
        [Required, StringLength(50)]
        public string Tipo { get; set; }
        [Required, StringLength(50)]
        public string Estado { get; set; }
        public int? Capacidad { get; set; }

        [StringLength(100)]
        public string? Ubicacion { get; set; }

        [StringLength(300)]
        public string? Descripcion { get; set; }

        // Relaciones
        [JsonIgnore]
        public ICollection<Cita> Citas { get; set; } = new List<Cita>();
    }
}
