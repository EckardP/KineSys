using ApiPrueba.data;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class EvolucionPacienteService : IEvolucionPacienteService
    {
        private readonly ClinicaFisioterapiaBD _db;
        public EvolucionPacienteService(ClinicaFisioterapiaBD db) => _db = db;

        public async Task<IEnumerable<EvolucionPaciente>> GetAllAsync(int? pacienteId = null)
        {
            var q = _db.EvolucionesPaciente.AsQueryable();
            if (pacienteId.HasValue) q = q.Where(e => e.IdPaciente == pacienteId.Value);
            return await q.OrderBy(e => e.Fecha).ToListAsync();
        }

        public async Task<EvolucionPaciente> GetByIdAsync(int id) => await _db.EvolucionesPaciente.FindAsync(id);

        public async Task<EvolucionPaciente> CreateAsync(EvolucionPaciente model)
        {
            _db.EvolucionesPaciente.Add(model);
            await _db.SaveChangesAsync();
            return model;
        }

        public async Task<EvolucionPaciente> UpdateAsync(EvolucionPaciente model)
        {
            var existing = await _db.EvolucionesPaciente.FindAsync(model.IdEvolucion);
            if (existing == null) return null;
            existing.Indicador = model.Indicador;
            existing.Valor = model.Valor;
            existing.Fecha = model.Fecha;
            _db.EvolucionesPaciente.Update(existing);
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var ex = await _db.EvolucionesPaciente.FindAsync(id);
            if (ex == null) return false;
            _db.EvolucionesPaciente.Remove(ex);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
