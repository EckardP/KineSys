using ApiPrueba.data;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class ReservaCitaService : IReservaCitaService
    {
        private readonly ClinicaFisioterapiaBD _db;
        public ReservaCitaService(ClinicaFisioterapiaBD db) => _db = db;

        public async Task<ReservaCita> GetByCitaIdAsync(int idCita) =>
            await _db.ReservasCita.FirstOrDefaultAsync(r => r.IdCita == idCita);

        public async Task<ReservaCita> CreateAsync(ReservaCita model)
        {
            model.FechaSolicitud = DateTime.UtcNow;
            model.Estado = "Pendiente";
            model.TokenConfirmacion = Guid.NewGuid().ToString("N");
            _db.ReservasCita.Add(model);
            await _db.SaveChangesAsync();
            return model;
        }

        public async Task<ReservaCita> ConfirmAsync(string token)
        {
            var reserva = await _db.ReservasCita.FirstOrDefaultAsync(r => r.TokenConfirmacion == token);
            if (reserva == null) return null;
            reserva.Estado = "Confirmada";
            reserva.FechaConfirmacion = DateTime.UtcNow;
            _db.ReservasCita.Update(reserva);

            // actualizar cita confirmada si aplica
            var cita = await _db.Citas.FindAsync(reserva.IdCita);
            if (cita != null)
            {
                cita.Confirmada = true;
                _db.Citas.Update(cita);
            }

            await _db.SaveChangesAsync();
            return reserva;
        }

        public async Task<bool> CancelAsync(int idReserva)
        {
            var r = await _db.ReservasCita.FindAsync(idReserva);
            if (r == null) return false;
            r.Estado = "Cancelada";
            _db.ReservasCita.Update(r);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
