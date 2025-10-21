using ApiPrueba.Models;

namespace ApiPrueba.Service.Interfaces
{
    public interface IProtocoloTratamientoService
    {
        Task<IEnumerable<ProtocoloTratamiento>> GetAllAsync();
        Task<ProtocoloTratamiento> GetByIdAsync(int id);
        Task<ProtocoloTratamiento> CreateAsync(ProtocoloTratamiento model);
        Task<ProtocoloTratamiento> UpdateAsync(ProtocoloTratamiento model);
        Task<bool> DeleteAsync(int id);
    }
}
