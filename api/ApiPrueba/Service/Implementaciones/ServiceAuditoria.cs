using ApiPrueba.data;
using ApiPrueba.DTO;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class ServicioAuditoria : IServiceAuditoria
    {
        private readonly ClinicaFisioterapiaBD _contexto;

        public ServicioAuditoria(ClinicaFisioterapiaBD contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<AuditoriaDTO>> ObtenerTodas()
        {
            return await _contexto.Auditorias
                .Select(a => new AuditoriaDTO
                {
                    Id = a.Id,
                    Usuario = a.Usuario,
                    Accion = a.Accion,
                    FechaAccion = a.FechaAccion
                }).ToListAsync();
        }

        public async Task RegistrarAccion(AuditoriaDTO auditoriaDto)
        {
            var auditoria = new Auditoria
            {
                Usuario = auditoriaDto.Usuario,
                Accion = auditoriaDto.Accion,
                FechaAccion = DateTime.Now
            };

            _contexto.Auditorias.Add(auditoria);
            await _contexto.SaveChangesAsync();
        }

        public async Task<bool> Eliminar(int id)
        {
            var auditoria = await _contexto.Auditorias.FindAsync(id);
            if (auditoria == null) return false;

            _contexto.Auditorias.Remove(auditoria);
            await _contexto.SaveChangesAsync();
            return true;
        }

        public Task ObtenerRegistros()
        {
            throw new NotImplementedException();
        }
    }
}
