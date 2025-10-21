using ApiPrueba.data;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class NotaSesionService : INotaSesionService
    {
        private readonly ClinicaFisioterapiaBD _db;
        public NotaSesionService(ClinicaFisioterapiaBD db) => _db = db;

        public async Task<IEnumerable<NotaSesion>> GetAllAsync(int? pacienteId = null)
        {
            var q = _db.NotasSesion.AsQueryable();
            if (pacienteId.HasValue) q = q.Where(n => n.IdPaciente == pacienteId.Value);
            return await q.ToListAsync();
        }

        public async Task<NotaSesion> GetByIdAsync(int id) => await _db.NotasSesion.FindAsync(id);

        public async Task<NotaSesion> CreateAsync(NotaSesion model)
        {
            model.Fecha = DateTime.UtcNow;
            _db.NotasSesion.Add(model);
            await _db.SaveChangesAsync();
            return model;
        }

        public async Task<NotaSesion> UpdateAsync(NotaSesion model)
        {
            var existing = await _db.NotasSesion.FindAsync(model.IdNota);
            if (existing == null) return null;
            existing.Notas = model.Notas;
            existing.Diagnostico = model.Diagnostico;
            existing.Recomendaciones = model.Recomendaciones;
            existing.CambioDiagnostico = model.CambioDiagnostico;
            existing.RegistradoPor = model.RegistradoPor;
            _db.NotasSesion.Update(existing);
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var ex = await _db.NotasSesion.FindAsync(id);
            if (ex == null) return false;
            _db.NotasSesion.Remove(ex);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
