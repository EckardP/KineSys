using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ApiPrueba.Models
{
    /// <summary>
    /// Registra valores numéricos o indicadores clínicos para graficar la evolución del paciente.
    /// </summary>
    public class EvolucionPaciente
    {
        [Key]
        public int IdEvolucion { get; set; }

        [Required]
        [ForeignKey("Paciente")]
        public int IdPaciente { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        [Required, StringLength(50)]
        public string Indicador { get; set; }

        [Required]
        public decimal Valor { get; set; }

        public Paciente Paciente { get; set; }
    }
}
