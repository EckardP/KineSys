using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    /// <summary>
    /// Representa un contacto de emergencia asociado a un paciente.
    /// </summary>
    public class ContactoEmergencia
    {
        [Key]
        public int IdContacto { get; set; }

        [Required]
        [ForeignKey("Paciente")]
        public int IdPaciente { get; set; }

        [Required, StringLength(80)]
        public string Nombre { get; set; }

        [Required, StringLength(50)]
        public string Parentesco { get; set; }

        [Required, StringLength(15)]
        public string TelefonoPrincipal { get; set; }

        [StringLength(15)]
        public string? TelefonoAlterno { get; set; }

        [StringLength(200)]
        public string? Observaciones { get; set; }
        [JsonIgnore]
        public Paciente? Paciente { get; set; }
    }
}
