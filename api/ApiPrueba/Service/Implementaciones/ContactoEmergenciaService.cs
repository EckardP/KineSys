using ApiPrueba.data;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class ContactoEmergenciaService : IContactoEmergenciaService
    {
        private readonly ClinicaFisioterapiaBD _db;
        public ContactoEmergenciaService(ClinicaFisioterapiaBD db) => _db = db;

        public async Task<IEnumerable<ContactoEmergencia>> GetAllAsync(int? pacienteId = null)
        {
            var query = _db.ContactosEmergencia.AsQueryable();
            if (pacienteId.HasValue) query = query.Where(c => c.IdPaciente == pacienteId.Value);
            return await query.ToListAsync();
        }

        public async Task<ContactoEmergencia> GetByIdAsync(int id) =>
            await _db.ContactosEmergencia.FindAsync(id);

        public async Task<ContactoEmergencia> CreateAsync(ContactoEmergencia model)
        {
            _db.ContactosEmergencia.Add(model);
            await _db.SaveChangesAsync();
            return model;
        }

        public async Task<ContactoEmergencia> UpdateAsync(ContactoEmergencia model)
        {
            var existing = await _db.ContactosEmergencia.FindAsync(model.IdContacto);
            if (existing == null) return null;

            existing.Nombre = model.Nombre;
            existing.Parentesco = model.Parentesco;
            existing.TelefonoPrincipal = model.TelefonoPrincipal;
            existing.TelefonoAlterno = model.TelefonoAlterno;
            existing.Observaciones = model.Observaciones;

            _db.ContactosEmergencia.Update(existing);
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _db.ContactosEmergencia.FindAsync(id);
            if (existing == null) return false;
            _db.ContactosEmergencia.Remove(existing);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
