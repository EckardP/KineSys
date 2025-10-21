namespace ApiPrueba.Models
{
    public class Terapeuta : Persona
    {
        public int IdEspecialidad { get; set; }
        public Especialidad Especialidad { get; set; }
        public string DocumentoIdentidad { get; set; }
        public string? CorreoElectronico { get; set; }

        //Relaciones
        public ICollection<Cita> Citas { get; set; }
        public ICollection<Tratamiento> Tratamientos { get; set; }

        //Nuevas relaciones
        public ICollection<DisponibilidadTerapeuta> Disponibilidades { get; set; }
    }
}
