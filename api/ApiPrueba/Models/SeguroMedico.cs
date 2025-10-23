using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class SeguroMedico
    {
        [Key]
        public int IdSeguro { get; set; }
        public string NombreAseguradora { get; set; }
        public string NumeroPoliza { get; set; }
        public string Cobertura { get; set; }
        public bool Activo { get; set; }

        [JsonIgnore]
        public ICollection<Paciente> Pacientes { get; set; } = new List<Paciente>();
    }
}
