using ApiPrueba.DTO;
using ApiPrueba.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ApiPrueba.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FacturacionController : ControllerBase
    {
        private readonly IServicioFactura _servicioFacturacion;

        public FacturacionController(IServicioFactura servicioFacturacion)
        {
            _servicioFacturacion = servicioFacturacion;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FacturaDTO>>> ObtenerTodas()
        {
            var facturas = await _servicioFacturacion.ObtenerTodas();
            return Ok(facturas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FacturaDTO>> ObtenerPorId(int id)
        {
            var factura = await _servicioFacturacion.ObtenerPorId(id);
            if (factura == null)
                return NotFound();
            return Ok(factura);
        }

        [HttpPost]
        public async Task<ActionResult> Crear(FacturaDTO factura)
        {
            await _servicioFacturacion.Crear(factura);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = factura.Id }, factura);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Actualizar(int id, FacturaDTO factura)
        {
            if (id != factura.Id)
                return BadRequest();

            var actualizado = await _servicioFacturacion.Actualizar(factura);
            if (!actualizado)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Eliminar(int id)
        {
            var eliminado = await _servicioFacturacion.Eliminar(id);
            if (!eliminado)
                return NotFound();

            return NoContent();
        }
    }
}
