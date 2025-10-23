using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class Especialidad
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        [JsonIgnore]
        public ICollection<TerapeutaEspecialidad> TerapeutaEspecialidades { get; set; } = new List<TerapeutaEspecialidad>();
    }
}

