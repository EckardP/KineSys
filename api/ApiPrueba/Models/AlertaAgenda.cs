using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ApiPrueba.Models
{
    /// <summary>
    /// Alerta generada por conflictos de horarios o sobrecarga en agenda.
    /// </summary>
    public class AlertaAgenda
    {
        [Key]
        public int IdAlerta { get; set; }

        [ForeignKey("Cita")]
        public int? IdCita { get; set; }

        [ForeignKey("Terapeuta")]
        public int IdTerapeuta { get; set; }

        [Required, StringLength(50)]
        public string TipoAlerta { get; set; } // Ej: Choque de horarios, Sobrecarga

        [Required, StringLength(200)]
        public string Descripcion { get; set; }

        public DateTime FechaGenerada { get; set; }

        public bool Resuelta { get; set; }

        public Cita Cita { get; set; }
        public Terapeuta Terapeuta { get; set; }
    }
}
