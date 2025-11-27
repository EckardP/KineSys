using System.ComponentModel.DataAnnotations;

namespace ApiPrueba.DTOs
{
    public class TratamientoCreateDto
    {
        [Required]
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int DuracionMinutos { get; set; } = 30;
        public int SesionesRecomendadas { get; set; } = 1;
        public string FrecuenciaRecomendada { get; set; } = "Semanal";
        public decimal CostoBase { get; set; }
        public string Indicaciones { get; set; }
        public string Contraindicaciones { get; set; }
        public bool Activo { get; set; } = true;
        public int? IdEspecialidad { get; set; }
        public int? IdPaciente { get; set; }
        public int? IdTerapeuta { get; set; }

        // Equipos del tratamiento
        public List<TratamientoEquipoCreateDto> TratamientoEquipos { get; set; } = new List<TratamientoEquipoCreateDto>();
    }
}