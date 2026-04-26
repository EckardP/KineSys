using NuGet.Common;
using System.Text.Json.Serialization;
using ApiPrueba.Models;

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
        public string? Celular { get; set; }
        public string? CorreoElectronico { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string? Genero { get; set; }
        public string? Direccion { get; set; }
        public string? Ciudad { get; set; }
        public string? Departamento { get; set; }
        public bool Activo { get; set; }
        public DateTime FechaRegistro { get; set; }
        public Rol Rol { get; set; }

        public class RegistroDto
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
            public bool Activo { get; set; }
            public DateTime FechaRegistro { get; set; }
            public Rol Rol { get; set; }
            public string? Ciudad { get; set; }
            public string? Departamento { get; set; }

            // 🔥 CAMBIOS CRÍTICOS - Hacer nullable
            public string? NoLicencia { get; set; }
            public string? TituloAcademico { get; set; }
            public int? AñosExperiencia { get; set; }           // ← Cambiado a nullable
            public DateTime? FechaContratacion { get; set; }    // ← Cambiado a nullable

            // Propiedades específicas del Paciente
            public int? EpsId { get; set; }
            public int? IdSeguroMedico { get; set; }
            public int? NumeroDeAfiliacion { get; set; }
            public string? TipoAfiliado { get; set; }
            public bool? EstadoAfiliacion { get; set; }
            public DateTime? FechaAfiliacion { get; set; }
            public string? Regimen { get; set; }
        }

        public class ActualizacionDto
        {
            // Campos comunes de Persona
            public string? Nombres { get; set; }
            public string? Apellidos { get; set; }
            public string? TipoDocumento { get; set; }
            public string? DocumentoIdentidad { get; set; }
            public string? Telefono { get; set; }
            public string? Celular { get; set; }
            public string? CorreoElectronico { get; set; }
            public DateTime FechaNacimiento { get; set; }
            public string? Genero { get; set; }
            public string? Direccion { get; set; }
            public string? Ciudad { get; set; }
            public string? Departamento { get; set; }
            public bool Activo { get; set; }

            // Rol para determinar el tipo
            public Rol Rol { get; set; }

            // Campos específicos de Paciente
            public int? IdSeguroMedico { get; set; }
            public int? EpsId { get; set; }
            public int? NumeroDeAfiliacion { get; set; }
            public string? TipoAfiliado { get; set; }
            public bool? EstadoAfiliacion { get; set; }
            public DateTime? FechaAfiliacion { get; set; }
            public string? Regimen { get; set; }

            // 🔥 CAMBIOS CRÍTICOS - Hacer nullable
            public string? NoLicencia { get; set; }
            public string? TituloAcademico { get; set; }
            public int? AñosExperiencia { get; set; }           // ← Cambiado a nullable
            public DateTime? FechaContratacion { get; set; }    // ← Cambiado a nullable
        }

        public class LoginDto
        {
            public string? User { get; set; }
            public string? Password { get; set; }
        }

        public class LoginResponseDto
        {
            public string? User { get; set; }
            public Rol Rol { get; set; }

            public Token? Token { get; set; }
        }

        //[JsonIgnore]
        //public Administrador? Usuario { get; set; }
    }

    // Agrega la clase Administrador que hereda de Persona
    public class Administrador : Persona
    {
        // Puedes agregar propiedades específicas del administrador aquí si es necesario
    }

    public class Recepcionista : Persona
    {

    }

    public class Contador : Persona
    {

    }

    public class Supervisor : Persona
    {

    }
}