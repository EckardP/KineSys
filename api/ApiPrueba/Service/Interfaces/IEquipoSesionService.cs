using ApiPrueba.Models;

namespace ApiPrueba.Service.Interfaces
{
    public interface IEquipoSesionService
    {
        Task<IEnumerable<EquipoSesion>> GetAllAsync(int? protocoloId = null);
        Task<EquipoSesion> GetByIdAsync(int id);
        Task<EquipoSesion> CreateAsync(EquipoSesion model);
        Task<EquipoSesion> UpdateAsync(EquipoSesion model);
        Task<bool> DeleteAsync(int id);
    }
}
