using ApiPrueba.Models;

namespace ApiPrueba.Service.Interfaces
{
    public interface INotaSesionService
    {
        Task<IEnumerable<NotaSesion>> GetAllAsync(int? pacienteId = null);
        Task<NotaSesion> GetByIdAsync(int id);
        Task<NotaSesion> CreateAsync(NotaSesion model);
        Task<NotaSesion> UpdateAsync(NotaSesion model);
        Task<bool> DeleteAsync(int id);
    }
}
