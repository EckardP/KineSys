using ApiPrueba.data;
using ApiPrueba.DTO;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class ServicioChat : IServicioChat
    {
        private readonly ClinicaFisioterapiaBD _contexto;

        public ServicioChat(ClinicaFisioterapiaBD contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<MensajeDTO>> ObtenerConversacion(int usuario1Id, int usuario2Id)
        {
            return await _contexto.MensajesChat
                .Where(m => (m.IdRemitente == usuario1Id && m.IdDestinatario == usuario2Id) ||
                            (m.IdRemitente == usuario2Id && m.IdDestinatario == usuario1Id))
                .OrderBy(m => m.FechaEnvio)
                .Select(m => new MensajeDTO
                {
                    Id = m.Id,
                    EmisorId = m.IdRemitente,
                    ReceptorId = m.IdDestinatario,
                    Contenido = m.Contenido,
                    Fecha = m.FechaEnvio
                }).ToListAsync();
        }

        public async Task EnviarMensaje(MensajeDTO mensajeDto)
        {
            var mensaje = new MensajeChat
            {
                IdRemitente = mensajeDto.EmisorId,
                IdDestinatario = mensajeDto.ReceptorId,
                Contenido = mensajeDto.Contenido,
                FechaEnvio = DateTime.Now
            };

            _contexto.MensajesChat.Add(mensaje);
            await _contexto.SaveChangesAsync();
        }

        public async Task<bool> EliminarMensaje(int id)
        {
            var mensaje = await _contexto.MensajesChat.FindAsync(id);
            if (mensaje == null) return false;

            _contexto.MensajesChat.Remove(mensaje);
            await _contexto.SaveChangesAsync();
            return true;
        }

        public Task ObtenerMensajes(int idConversacion)
        {
            throw new NotImplementedException();
        }
    }
}
