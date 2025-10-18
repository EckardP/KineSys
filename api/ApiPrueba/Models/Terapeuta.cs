namespace ApiPrueba.Models
{
    public class Terapeuta : Persona
    {
        public int IdEspecialidad { get; set; }
        public Especialidad Especialidad { get; set; }
        public string Email { get; set; }

        public ICollection<Cita> Citas { get; set; }
        public ICollection<Tratamiento> Tratamientos { get; set; }
    }
}
