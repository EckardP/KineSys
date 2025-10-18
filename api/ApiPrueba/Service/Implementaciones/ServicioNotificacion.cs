using ApiPrueba.data;
using ApiPrueba.DTO;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class ServicioNotificacion : IServicioNotificacion
    {
        private readonly ClinicaFisioterapiaBD _contexto;

        public ServicioNotificacion(ClinicaFisioterapiaBD contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<NotificacionDTO>> ObtenerTodas()
        {
            return await _contexto.Notificaciones
                .Select(n => new NotificacionDTO
                {
                    Id = n.Id,
                    Mensaje = n.Mensaje,
                    Fecha = n.FechaEnvio,
                    EsLeida = n.Leida
                }).ToListAsync();
        }

        public async Task<NotificacionDTO> ObtenerPorId(int id)
        {
            var notificacion = await _contexto.Notificaciones.FindAsync(id);
            if (notificacion == null) return null;

            return new NotificacionDTO
            {
                Id = notificacion.Id,
                Mensaje = notificacion.Mensaje,
                Fecha = notificacion.FechaEnvio,
                EsLeida = notificacion.Leida
            };
        }

        public async Task Crear(NotificacionDTO notificacionDto)
        {
            var notificacion = new Notificacion
            {
                Mensaje = notificacionDto.Mensaje,
                FechaEnvio = DateTime.Now,
                Leida = false
            };

            _contexto.Notificaciones.Add(notificacion);
            await _contexto.SaveChangesAsync();
        }

        public async Task<bool> MarcarComoLeida(int id)
        {
            var notificacion = await _contexto.Notificaciones.FindAsync(id);
            if (notificacion == null) return false;

            notificacion.Leida = true;
            await _contexto.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            var notificacion = await _contexto.Notificaciones.FindAsync(id);
            if (notificacion == null) return false;

            _contexto.Notificaciones.Remove(notificacion);
            await _contexto.SaveChangesAsync();
            return true;
        }

        public Task Enviar(NotificacionDTO notificacion)
        {
            throw new NotImplementedException();
        }

        public Task GenerarReportePacientes()
        {
            throw new NotImplementedException();
        }
    }
}
