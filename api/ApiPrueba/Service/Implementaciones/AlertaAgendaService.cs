using ApiPrueba.data;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class AlertaAgendaService : IAlertaAgendaService
    {
        private readonly ClinicaFisioterapiaBD _db;
        public AlertaAgendaService(ClinicaFisioterapiaBD db) => _db = db;

        public async Task<IEnumerable<AlertaAgenda>> GetAllAsync(int? terapeutaId = null)
        {
            var q = _db.AlertasAgenda.AsQueryable();
            if (terapeutaId.HasValue) q = q.Where(a => a.IdTerapeuta == terapeutaId.Value);
            return await q.ToListAsync();
        }

        public async Task<AlertaAgenda> GetByIdAsync(int id) => await _db.AlertasAgenda.FindAsync(id);

        public async Task<AlertaAgenda> CreateAsync(AlertaAgenda model)
        {
            model.FechaGenerada = DateTime.UtcNow;
            _db.AlertasAgenda.Add(model);
            await _db.SaveChangesAsync();
            return model;
        }

        public async Task<AlertaAgenda> UpdateAsync(AlertaAgenda model)
        {
            var existing = await _db.AlertasAgenda.FindAsync(model.IdAlerta);
            if (existing == null) return null;
            existing.TipoAlerta = model.TipoAlerta;
            existing.Descripcion = model.Descripcion;
            existing.Resuelta = model.Resuelta;
            _db.AlertasAgenda.Update(existing);
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var ex = await _db.AlertasAgenda.FindAsync(id);
            if (ex == null) return false;
            _db.AlertasAgenda.Remove(ex);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
