using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class Terapeuta : Persona
    {
        //public string DocumentoIdentidad { get; set; }
        //public string? CorreoElectronico { get; set; }

        public string NoLicencia { get; set; }
        public string TituloAcademico { get; set; }
        public int AñosExperiencia { get; set; }
        public DateTime FechaContratacion { get; set; }

        //Relaciones
        [JsonIgnore]
        public ICollection<Cita> Citas { get; set; } = new List<Cita>();
        [JsonIgnore]
        public ICollection<Tratamiento> Tratamientos { get; set; } = new List<Tratamiento>();
        [JsonIgnore]
        public ICollection<DisponibilidadTerapeuta> Disponibilidades { get; set; } = new List<DisponibilidadTerapeuta>();
        [JsonIgnore]
        public ICollection<TerapeutaEspecialidad> TerapeutaEspecialidades { get; set; } = new List<TerapeutaEspecialidad>();
        [JsonIgnore]
        public ICollection<AlertaAgenda> AlertasAgenda { get; set; } = new List<AlertaAgenda>();
        [JsonIgnore]
        public ICollection<PlanTratamiento> PlanesTratamiento { get; set; } = new List<PlanTratamiento>();
    }
}
