using ApiPrueba.DTO;
using ApiPrueba.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ApiPrueba.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TratamientosController : ControllerBase
    {
        private readonly IServiceTratamiento _servicioTratamiento;

        public TratamientosController(IServiceTratamiento servicioTratamiento)
        {
            _servicioTratamiento = servicioTratamiento;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TratamientoDTO>>> ObtenerTodos()
        {
            var lista = await _servicioTratamiento.ObtenerTodos();
            return Ok(lista);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TratamientoDTO>> ObtenerPorId(int id)
        {
            var tratamiento = await _servicioTratamiento.ObtenerPorId(id);
            if (tratamiento == null)
                return NotFound();
            return Ok(tratamiento);
        }

        [HttpPost]
        public async Task<ActionResult> Crear(TratamientoDTO tratamiento)
        {
            await _servicioTratamiento.Crear(tratamiento);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = tratamiento.Id }, tratamiento);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Actualizar(int id, TratamientoDTO tratamiento)
        {
            if (id != tratamiento.Id)
                return BadRequest();

            var actualizado = await _servicioTratamiento.Actualizar(tratamiento);
            if (!actualizado)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Eliminar(int id)
        {
            var eliminado = await _servicioTratamiento.Eliminar(id);
            if (!eliminado)
                return NotFound();

            return NoContent();
        }
    }
}
