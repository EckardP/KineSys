using ApiPrueba.data;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class DisponibilidadTerapeutaService : IDisponibilidadTerapeutaService
    {
        private readonly ClinicaFisioterapiaBD _db;
        public DisponibilidadTerapeutaService(ClinicaFisioterapiaBD db) => _db = db;

        public async Task<IEnumerable<DisponibilidadTerapeuta>> GetAllAsync(int? terapeutaId = null)
        {
            var q = _db.DisponibilidadesTerapeutas.AsQueryable();
            if (terapeutaId.HasValue) q = q.Where(d => d.IdTerapeuta == terapeutaId.Value);
            return await q.ToListAsync();
        }

        public async Task<DisponibilidadTerapeuta> GetByIdAsync(int id) => await _db.DisponibilidadesTerapeutas.FindAsync(id);

        public async Task<DisponibilidadTerapeuta> CreateAsync(DisponibilidadTerapeuta model)
        {
            // Validación simple: que la horaInicio < horaFin
            if (model.HoraInicio >= model.HoraFin) return null;
            _db.DisponibilidadesTerapeutas.Add(model);
            await _db.SaveChangesAsync();
            return model;
        }

        public async Task<DisponibilidadTerapeuta> UpdateAsync(DisponibilidadTerapeuta model)
        {
            var existing = await _db.DisponibilidadesTerapeutas.FindAsync(model.IdDisponibilidad);
            if (existing == null) return null;
            existing.DiaSemana = model.DiaSemana;
            existing.HoraInicio = model.HoraInicio;
            existing.HoraFin = model.HoraFin;
            existing.Disponible = model.Disponible;
            existing.TipoAmbiente = model.TipoAmbiente;
            _db.DisponibilidadesTerapeutas.Update(existing);
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var ex = await _db.DisponibilidadesTerapeutas.FindAsync(id);
            if (ex == null) return false;
            _db.DisponibilidadesTerapeutas.Remove(ex);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
