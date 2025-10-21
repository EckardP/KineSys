using ApiPrueba.Models;

namespace ApiPrueba.Service.Interfaces
{
    public interface IReservaCitaService
    {
        Task<ReservaCita> GetByCitaIdAsync(int idCita);
        Task<ReservaCita> CreateAsync(ReservaCita model);
        Task<ReservaCita> ConfirmAsync(string token);
        Task<bool> CancelAsync(int idReserva);
    }
}
