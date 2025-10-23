using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    [JsonDerivedType(typeof(Paciente), typeDiscriminator: "paciente")]
    [JsonDerivedType(typeof(Terapeuta), typeDiscriminator: "terapeuta")]
    public abstract class Persona
    {

        public int Id { get; set; }
        public string NombreCompleto { get; set; }
        public string DocumentoIdentidad { get; set; }
        public string Telefono { get; set; }
        public string CorreoElectronico { get; set; }
    }
}
