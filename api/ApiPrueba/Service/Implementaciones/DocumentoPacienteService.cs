using ApiPrueba.data;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class DocumentoPacienteService : IDocumentoPacienteService
    {
        private readonly ClinicaFisioterapiaBD _db;
        public DocumentoPacienteService(ClinicaFisioterapiaBD db) => _db = db;

        public async Task<IEnumerable<DocumentoPaciente>> GetAllAsync(int? pacienteId = null)
        {
            var q = _db.DocumentosPaciente.AsQueryable();
            if (pacienteId.HasValue) q = q.Where(d => d.IdPaciente == pacienteId.Value);
            return await q.ToListAsync();
        }

        public async Task<DocumentoPaciente> GetByIdAsync(int id) => await _db.DocumentosPaciente.FindAsync(id);

        public async Task<DocumentoPaciente> CreateAsync(DocumentoPaciente model)
        {
            model.FechaSubida = DateTime.UtcNow;
            _db.DocumentosPaciente.Add(model);
            await _db.SaveChangesAsync();
            return model;
        }

        public async Task<DocumentoPaciente> UpdateAsync(DocumentoPaciente model)
        {
            var existing = await _db.DocumentosPaciente.FindAsync(model.IdDocumento);
            if (existing == null) return null;

            existing.TipoDocumento = model.TipoDocumento;
            existing.NombreArchivo = model.NombreArchivo;
            existing.Ruta = model.Ruta;
            existing.MimeType = model.MimeType;
            existing.SubidoPor = model.SubidoPor;

            _db.DocumentosPaciente.Update(existing);
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var ex = await _db.DocumentosPaciente.FindAsync(id);
            if (ex == null) return false;
            _db.DocumentosPaciente.Remove(ex);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
