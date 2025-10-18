using ApiPrueba.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ApiPrueba.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuditoriaController : ControllerBase
    {
        private readonly IServiceAuditoria _servicioAuditoria;

        public AuditoriaController(IServiceAuditoria servicioAuditoria)
        {
            _servicioAuditoria = servicioAuditoria;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> ObtenerRegistros()
        {
            // Cambiar la llamada a un método que devuelva un valor en lugar de void
            var auditoria = await _servicioAuditoria.ObtenerTodas();
            return Ok(auditoria);
        }
    }
}
