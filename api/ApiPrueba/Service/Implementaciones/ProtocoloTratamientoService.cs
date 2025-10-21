using ApiPrueba.data;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class ProtocoloTratamientoService : IProtocoloTratamientoService
    {
        private readonly ClinicaFisioterapiaBD _db;
        public ProtocoloTratamientoService(ClinicaFisioterapiaBD db) => _db = db;

        public async Task<IEnumerable<ProtocoloTratamiento>> GetAllAsync() =>
            await _db.ProtocolosTratamiento.Include(p => p.EquiposRequeridos).ToListAsync();

        public async Task<ProtocoloTratamiento> GetByIdAsync(int id) =>
            await _db.ProtocolosTratamiento.Include(p => p.EquiposRequeridos)
                .FirstOrDefaultAsync(p => p.IdProtocolo == id);

        public async Task<ProtocoloTratamiento> CreateAsync(ProtocoloTratamiento model)
        {
            _db.ProtocolosTratamiento.Add(model);
            await _db.SaveChangesAsync();
            return model;
        }

        public async Task<ProtocoloTratamiento> UpdateAsync(ProtocoloTratamiento model)
        {
            var existing = await _db.ProtocolosTratamiento.FindAsync(model.IdProtocolo);
            if (existing == null) return null;
            existing.Nombre = model.Nombre;
            existing.Descripcion = model.Descripcion;
            existing.NumeroSesiones = model.NumeroSesiones;
            existing.DuracionPorSesionMin = model.DuracionPorSesionMin;
            existing.Recomendaciones = model.Recomendaciones;
            _db.ProtocolosTratamiento.Update(existing);
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var ex = await _db.ProtocolosTratamiento.FindAsync(id);
            if (ex == null) return false;
            _db.ProtocolosTratamiento.Remove(ex);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
