using System.Text.Json.Serialization;

namespace ApiPrueba.Models
{
    public class Paciente : Persona
    {

        // Relaciones
        public int? IdSeguroMedico { get; set; }
        [JsonIgnore]
        public SeguroMedico? SeguroMedico { get; set; }
        [JsonIgnore]
        public HistorialMedico? HistorialMedico { get; set; }

        [JsonIgnore]
        public ICollection<Cita> Citas { get; set; } = new List<Cita>();
        [JsonIgnore]
        public ICollection<Tratamiento> Tratamientos { get; set; } = new List<Tratamiento>();
        [JsonIgnore]
        public ICollection<PlanTratamiento> PlanesTratamiento { get; set; } = new List<PlanTratamiento>();
        [JsonIgnore]
        public ICollection<NotaSesion> NotasSesion { get; set; } = new List<NotaSesion>();

        //Nuevas relaciones
        [JsonIgnore]
        public ICollection<ContactoEmergencia> ContactosEmergencia { get; set; } = new List<ContactoEmergencia>();
        [JsonIgnore]
        public ICollection<DocumentoPaciente> Documentos { get; set; } = new List<DocumentoPaciente>();
        [JsonIgnore]
        public ICollection<EvolucionPaciente> Evoluciones { get; set; } = new List<EvolucionPaciente>();

        [JsonIgnore]
        public ICollection<Diagnostico> Diagnosticos { get; set; } = new List<Diagnostico>();
    }
}
