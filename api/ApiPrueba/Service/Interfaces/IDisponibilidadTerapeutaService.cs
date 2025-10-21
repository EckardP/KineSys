using ApiPrueba.Models;

namespace ApiPrueba.Service.Interfaces
{
    public interface IDisponibilidadTerapeutaService
    {
        Task<IEnumerable<DisponibilidadTerapeuta>> GetAllAsync(int? terapeutaId = null);
        Task<DisponibilidadTerapeuta> GetByIdAsync(int id);
        Task<DisponibilidadTerapeuta> CreateAsync(DisponibilidadTerapeuta model);
        Task<DisponibilidadTerapeuta> UpdateAsync(DisponibilidadTerapeuta model);
        Task<bool> DeleteAsync(int id);
    }
}
