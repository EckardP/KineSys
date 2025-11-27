using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    /// <summary>
    /// Define los horarios de trabajo disponibles de cada terapeuta.
    /// </summary>
    public class DisponibilidadTerapeuta
    {
        [Key]
        public int IdDisponibilidad { get; set; }

        [Required, StringLength(15)]
        public string DiaSemana { get; set; }  // Ej: "Lunes", "Martes"

        [Required]
        public TimeSpan HoraInicio { get; set; }

        [Required]
        public TimeSpan HoraFin { get; set; }

        [Required]
        public bool Disponible { get; set; }

        [StringLength(20)]
        public string? TipoAmbiente { get; set; } // Calle u Oficina

        //Relaciones

        public int? IdCita { get; set; }
        [JsonIgnore]
        [ForeignKey("IdCita")]
        public Cita? Cita { get; set; }


        [Required]
        public int IdTerapeuta { get; set; }

        [JsonIgnore]
        [ForeignKey("IdTerapeuta")]
        public Terapeuta? Terapeuta { get; set; }
    }
}
