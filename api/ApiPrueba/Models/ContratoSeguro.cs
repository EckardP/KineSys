using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class ContratoSeguro
    {
        [Key]
        public int ContratoId { get; set; }
        public string NumeroPoliza { get; set; }
        public string Cobertura { get; set; }
        public bool Activo { get; set; }

        // Relaciones

        public int IdSeguroMedico { get; set; }
        [ForeignKey("IdSeguroMedico")]
        [JsonIgnore]
        public SeguroMedico? SeguroMedico { get; set; }

        public  int IdPaciente { get; set; }
        [ForeignKey("IdPaciente")]
        [JsonIgnore]
        public Paciente? Paciente { get; set; }
    }
}
