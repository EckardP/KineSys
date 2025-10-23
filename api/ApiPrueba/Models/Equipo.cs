using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class Equipo
    {
        [Key]
        public int IdEquipo { get; set; }
        public string NombreEquipo { get; set; }
        public string Descripcion { get; set; }
        public string Estado { get; set; } // Disponible, En Mantenimiento, Dañado
        public int Cantidad { get; set; }
        public string Ubicacion { get; set; }
        [JsonIgnore]
        public ICollection<EquipoSesion> EquiposSesion { get; set; } = new List<EquipoSesion>();

        //Relaciones
        //public int IdEquipoSesion { get; set; }

        //[JsonIgnore]
        //public EquipoSesion EquiposSesion { get; set; }
    }
}
