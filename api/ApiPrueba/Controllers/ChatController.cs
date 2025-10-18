using ApiPrueba.DTO;
using ApiPrueba.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ApiPrueba.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IServicioChat _servicioChat;

        public ChatController(IServicioChat servicioChat)
        {
            _servicioChat = servicioChat;
        }

        [HttpGet("{idConversacion}")]
        public async Task<ActionResult<IEnumerable<MensajeDTO>>> ObtenerMensajes(int idConversacion)
        {
            var mensajes = await _servicioChat.ObtenerConversacion(idConversacion, idConversacion);
            return Ok(mensajes);
        }

        [HttpPost]
        public async Task<ActionResult> EnviarMensaje(MensajeDTO mensaje)
        {
            await _servicioChat.EnviarMensaje(mensaje);
            return Ok("Mensaje enviado correctamente.");
        }
    }
}
