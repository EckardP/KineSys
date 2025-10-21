namespace ApiPrueba.DTO
{
    public class CitaDTO
    {
        public int Id { get; set; }
        public int DuracionProgramadaMin { get; set; }
        public DateTime? HoraInicioReal { get; set; }
        public DateTime? HoraFinReal { get; set; }
        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }
        public bool Confirmada { get; set; }

        public int IdPaciente { get; set; }
        public int IdTerapeuta { get; set; }
        public int? IdTratamiento { get; set; }

        // Opcional: nombres solo para mostrar
        public string NombrePaciente { get; set; }
        public string NombreTerapeuta { get; set; }
        public string NombreTratamiento { get; set; }
    }
}
