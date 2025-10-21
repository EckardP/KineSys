using ApiPrueba.data;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class EquipoSesionService : IEquipoSesionService
    {
        private readonly ClinicaFisioterapiaBD _db;
        public EquipoSesionService(ClinicaFisioterapiaBD db) => _db = db;

        public async Task<IEnumerable<EquipoSesion>> GetAllAsync(int? protocoloId = null)
        {
            var q = _db.EquiposSesion.Include(e => e.Equipo).AsQueryable();
            if (protocoloId.HasValue) q = q.Where(e => e.IdProtocolo == protocoloId.Value);
            return await q.ToListAsync();
        }

        public async Task<EquipoSesion> GetByIdAsync(int id) => await _db.EquiposSesion.FindAsync(id);

        public async Task<EquipoSesion> CreateAsync(EquipoSesion model)
        {
            _db.EquiposSesion.Add(model);
            await _db.SaveChangesAsync();
            return model;
        }

        public async Task<EquipoSesion> UpdateAsync(EquipoSesion model)
        {
            var existing = await _db.EquiposSesion.FindAsync(model.IdEquipoSesion);
            if (existing == null) return null;
            existing.CantidadUsada = model.CantidadUsada;
            existing.Observaciones = model.Observaciones;
            _db.EquiposSesion.Update(existing);
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var ex = await _db.EquiposSesion.FindAsync(id);
            if (ex == null) return false;
            _db.EquiposSesion.Remove(ex);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
