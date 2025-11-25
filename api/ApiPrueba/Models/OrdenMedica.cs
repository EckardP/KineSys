using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class OrdenMedica
    {
        [Key]
        public int IdOrdenMedica { get; set; }
        [Required]
        public int IdPaciente { get; set; }
        public int? IdTipoDocumento { get; set; }
        [Required, StringLength(100)]
        public string NumeroOrden { get; set; }
        [Required]
        public DateTime FechaEmision { get; set; }
        public DateTime? FechaVencimiento { get; set; }
        [Required, StringLength(200)]
        public string MedicoEmite { get; set; }
        [StringLength(100)]
        public string? Especialidad { get; set; }
        [StringLength(500)]
        public string? Diagnostico { get; set; }
        [StringLength(500)]
        public string TratamientoOrdenado { get; set; }
        public int? NumeroSesionesAutorizadas { get; set; }
        public int SesionesConsumidas { get; set; } = 0;
        [Required, StringLength(50)]
        public string Estado { get; set; }
        [StringLength(300)]
        public string? RutaSoporte { get; set; }
        [StringLength(500)]
        public string? Observaciones { get; set; }

        // Relaciones
        [ForeignKey("IdPaciente")]
        [JsonIgnore]
        public Paciente? Paciente { get; set; }
        [ForeignKey("IdTipoDocumento")]
        [JsonIgnore]

        public TipoDocumentoEnum? TipoDocumento { get; set; }
        [JsonIgnore]
        public ICollection<Cita> Citas { get; set; } = new List<Cita>();
    }
}
