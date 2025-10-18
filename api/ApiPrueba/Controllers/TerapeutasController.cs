using ApiPrueba.data;
using ApiPrueba.DTO;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TerapeutasController : ControllerBase
    {
        private readonly IServicioTerapeuta _servicioTerapeuta;

        public TerapeutasController(IServicioTerapeuta servicioTerapeuta)
        {
            _servicioTerapeuta = servicioTerapeuta;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TerapeutaDTO>>> ObtenerTodos()
        {
            var terapeutas = await _servicioTerapeuta.ObtenerTodos();
            return Ok(terapeutas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TerapeutaDTO>> ObtenerPorId(int id)
        {
            var terapeuta = await _servicioTerapeuta.ObtenerPorId(id);
            if (terapeuta == null)
                return NotFound();
            return Ok(terapeuta);
        }

        [HttpPost]
        public async Task<ActionResult> Crear(TerapeutaDTO terapeuta)
        {
            await _servicioTerapeuta.Crear(terapeuta);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = terapeuta.Id }, terapeuta);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Actualizar(int id, TerapeutaDTO terapeuta)
        {
            if (id != terapeuta.Id)
                return BadRequest();

            var actualizado = await _servicioTerapeuta.Actualizar(terapeuta);
            if (!actualizado)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Eliminar(int id)
        {
            var eliminado = await _servicioTerapeuta.Eliminar(id);
            if (!eliminado)
                return NotFound();

            return NoContent();
        }
    }
}
