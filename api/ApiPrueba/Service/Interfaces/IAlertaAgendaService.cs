using ApiPrueba.Models;

namespace ApiPrueba.Service.Interfaces
{
    public interface IAlertaAgendaService
    {
        Task<IEnumerable<AlertaAgenda>> GetAllAsync(int? terapeutaId = null);
        Task<AlertaAgenda> GetByIdAsync(int id);
        Task<AlertaAgenda> CreateAsync(AlertaAgenda model);
        Task<AlertaAgenda> UpdateAsync(AlertaAgenda model);
        Task<bool> DeleteAsync(int id);
    }
}
