using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    /// <summary>
    /// Alerta generada por conflictos de horarios o sobrecarga en agenda.
    /// </summary>
    public class AlertaAgenda
    {
        [Key]
        public int IdAlerta { get; set; }
        public int? IdCita { get; set; }
        public int IdTerapeuta { get; set; }

        [Required, StringLength(50)]
        public string TipoAlerta { get; set; } // Ej: Choque de horarios, Sobrecarga

        [Required, StringLength(200)]
        public string Descripcion { get; set; }

        public DateTime FechaGenerada { get; set; }

        public bool Resuelta { get; set; }

        [JsonIgnore]
        [ForeignKey("IdCita")]
        public Cita? Cita { get; set; }
        [JsonIgnore]
        [ForeignKey("IdTerapeuta")]
        public Terapeuta? Terapeuta { get; set; }
    }
}
