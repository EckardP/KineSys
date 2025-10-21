using ApiPrueba.Models;

namespace ApiPrueba.Service.Interfaces
{
    public interface IDocumentoPacienteService
    {
        Task<IEnumerable<DocumentoPaciente>> GetAllAsync(int? pacienteId = null);
        Task<DocumentoPaciente> GetByIdAsync(int id);
        Task<DocumentoPaciente> CreateAsync(DocumentoPaciente model);
        Task<DocumentoPaciente> UpdateAsync(DocumentoPaciente model);
        Task<bool> DeleteAsync(int id);
    }
}
