using ApiPrueba.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApiPrueba.Service.Interfaces
{
    public interface IContactoEmergenciaService
    {
        Task<IEnumerable<ContactoEmergencia>> GetAllAsync(int? pacienteId = null);
        Task<ContactoEmergencia> GetByIdAsync(int id);
        Task<ContactoEmergencia> CreateAsync(ContactoEmergencia model);
        Task<ContactoEmergencia> UpdateAsync(ContactoEmergencia model);
        Task<bool> DeleteAsync(int id);
    }
}
