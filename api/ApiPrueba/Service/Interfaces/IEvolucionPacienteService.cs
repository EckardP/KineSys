using ApiPrueba.Models;

namespace ApiPrueba.Service.Interfaces
{
    public interface IEvolucionPacienteService
    {
        Task<IEnumerable<EvolucionPaciente>> GetAllAsync(int? pacienteId = null);
        Task<EvolucionPaciente> GetByIdAsync(int id);
        Task<EvolucionPaciente> CreateAsync(EvolucionPaciente model);
        Task<EvolucionPaciente> UpdateAsync(EvolucionPaciente model);
        Task<bool> DeleteAsync(int id);
    }
}
