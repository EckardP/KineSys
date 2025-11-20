using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApiPrueba.Models
{
    
    public class Auditoria
    {
        [Key]
        public int IdAuditoria { get; set; }

        [Required, StringLength(100)]
        public string Entidad { get; set; } // Nombre de la tabla/entidad afectada

        [Required]
        public int IdEntidad { get; set; } // ID del registro afectado

        [Required, StringLength(50)]
        public string Accion { get; set; } // CREATE, UPDATE, DELETE, READ

        public int? IdPersona { get; set; } // Usuario que realizó la acción

        [StringLength(100)]
        public string? NombreUsuario { get; set; }

        [Required]
        public DateTime FechaHora { get; set; } = DateTime.Now;

        [StringLength(100)]
        public string? DireccionIP { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? ValoresAnteriores { get; set; } // JSON con valores antes del cambio

        [Column(TypeName = "nvarchar(max)")]
        public string? ValoresNuevos { get; set; } // JSON con valores después del cambio

        [StringLength(500)]
        public string? Observaciones { get; set; }

        [Required]
        public bool Exitoso { get; set; } = true;

        [StringLength(500)]
        public string? MensajeError { get; set; }
    }
}
