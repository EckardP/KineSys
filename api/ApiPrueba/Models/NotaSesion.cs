using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    /// <summary>
    /// Nota clínica detallada que documenta la evolución del paciente en una sesión.
    /// </summary>
    public class NotaSesion
    {
        [Key]
        public int IdNota { get; set; }

        [Required]
        [ForeignKey("Cita")]
        public int IdCita { get; set; }

        [Required]
        [ForeignKey("Paciente")]
        public int IdPaciente { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        [StringLength(500)]
        public string Notas { get; set; }

        [StringLength(200)]
        public string Diagnostico { get; set; }

        [StringLength(300)]
        public string Recomendaciones { get; set; }

        [StringLength(50)]
        public string CambioDiagnostico { get; set; }

        [StringLength(80)]
        public string RegistradoPor { get; set; }

        [JsonIgnore]
        public Paciente Paciente { get; set; }
        [JsonIgnore]
        public Cita Cita { get; set; }
    }
}
