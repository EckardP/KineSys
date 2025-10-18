using ApiPrueba.DTO;
using ApiPrueba.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ApiPrueba.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventarioController : ControllerBase
    {
        private readonly IServicioInventario _servicioInventario;

        public InventarioController(IServicioInventario servicioInventario)
        {
            _servicioInventario = servicioInventario;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EquipoDTO>>> ObtenerTodos()
        {
            var equipos = await _servicioInventario.ObtenerTodos();
            return Ok(equipos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EquipoDTO>> ObtenerPorId(int id)
        {
            var equipo = await _servicioInventario.ObtenerPorId(id);
            if (equipo == null)
                return NotFound();
            return Ok(equipo);
        }

        [HttpPost]
        public async Task<ActionResult> Crear(EquipoDTO equipo)
        {
            await _servicioInventario.Crear(equipo);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = equipo.Id }, equipo);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Actualizar(int id, EquipoDTO equipo)
        {
            if (id != equipo.Id)
                return BadRequest();

            var actualizado = await _servicioInventario.Actualizar(equipo);
            if (!actualizado)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Eliminar(int id)
        {
            var eliminado = await _servicioInventario.Eliminar(id);
            if (!eliminado)
                return NotFound();

            return NoContent();
        }
    }
}
