using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class Administrador
    {
        [Key]
        public int IdAdministrador { get; set; }

        [Required]
        [StringLength(50)]
        public string NombreUsuario { get; set; }

        [Required]
        public string CorreoElectronico { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        public Rol Rol { get; set; }

        public bool Activo { get; set; } = true;

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        public DateTime? UltimoAcceso { get; set; }

        
        public int? IdPersona { get; set; }
        [JsonIgnore]
        public Persona? Persona { get; set; }


        // Token de refresh para mantener sesión
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiracion { get; set; }
    }
}
