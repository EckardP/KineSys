using ApiPrueba.DTO;
using ApiPrueba.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ApiPrueba.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificacionesController : ControllerBase
    {
        private readonly IServicioNotificacion _servicioNotificacion;

        public NotificacionesController(IServicioNotificacion servicioNotificacion)
        {
            _servicioNotificacion = servicioNotificacion;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificacionDTO>>> ObtenerTodas()
        {
            var notificaciones = await _servicioNotificacion.ObtenerTodas();
            return Ok(notificaciones);
        }

        [HttpPost]
        public async Task<ActionResult> Enviar(NotificacionDTO notificacion)
        {
            await _servicioNotificacion.Enviar(notificacion);
            return Ok("Notificación enviada correctamente.");
        }
    }
}
