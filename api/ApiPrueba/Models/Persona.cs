using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    [JsonDerivedType(typeof(Paciente), typeDiscriminator: "paciente")]
    [JsonDerivedType(typeof(Terapeuta), typeDiscriminator: "terapeuta")]
    public abstract class Persona
    {

        public int Id { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string DocumentoIdentidad { get; set; }
        public string Telefono { get; set; }
        public string CorreoElectronico { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string Genero { get; set; }
        public string Direccion { get; set; }
    }
}
