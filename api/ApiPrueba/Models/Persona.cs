using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    
    public abstract class Persona
    {

        public int Id { get; set; }
        public string? User { get; set; }
        public string? Password { get; set; }
        public string? Nombres { get; set; }
        public string? Apellidos { get; set; }
        public string? TipoDocumento { get; set; }
        public string? DocumentoIdentidad { get; set; }
        public string? Telefono { get; set; }
        public string? CorreoElectronico { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string? Genero { get; set; }
        public string? Direccion { get; set; }
        public Rol Rol { get; set; }


        public class RegistroDto
        {
            public int Id { get; set; }
            public string? User { get; set; }
            public string? Password { get; set; }
            public string? Nombres { get; set; }
            public string? Apellidos { get; set; }
            public string? DocumentoIdentidad { get; set; }
            public Rol rol { get; set; }
        }

        public class LoginDto
        {
            public string? User { get; set; }
            public string? Password { get; set; }
        }

        public class LoginResponseDto
        {
            public int Id { get; set; }
            public string? User { get; set; }
            public string? Nombres { get; set; }
            public string? Apellidos { get; set; }
            public Rol Rol { get; set; }
        }

        //[JsonIgnore]
        //public Administrador? Usuario { get; set; }
    }
}
