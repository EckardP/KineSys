using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    /// <summary>
    /// Registro de confirmaciones o reservas online de citas.
    /// </summary>
    public class ReservaCita
    {
        [Key]
        public int IdReserva { get; set; }

        [ForeignKey("Cita")]
        public int IdCita { get; set; }

        [Required, StringLength(120)]
        public string TokenConfirmacion { get; set; }

        public DateTime FechaSolicitud { get; set; }
        public bool Confirmada { get; set; }

        public DateTime? FechaConfirmacion { get; set; }

        [StringLength(20)]
        public string MetodoConfirmacion { get; set; } // Email / SMS / WhatsApp

        [Required, StringLength(20)]
        public string Estado { get; set; } // Pendiente / Confirmada / Cancelada

        [JsonIgnore]
        public Cita? Cita { get; set; }
    }
}
