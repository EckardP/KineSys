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
    public class CitasController : ControllerBase
    {
        private readonly IServicioCita _servicioCita;

        public CitasController(IServicioCita servicioCita)
        {
            _servicioCita = servicioCita;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CitaDTO>>> ObtenerTodas()
        {
            var citas = await _servicioCita.ObtenerTodas();
            return Ok(citas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CitaDTO>> ObtenerPorId(int id)
        {
            var cita = await _servicioCita.ObtenerPorId(id);
            if (cita == null)
                return NotFound();
            return Ok(cita);
        }

        [HttpPost]
        public async Task<ActionResult> Crear(CitaDTO cita)
        {
            await _servicioCita.Crear(cita);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = cita.Id }, cita);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Actualizar(int id, CitaDTO cita)
        {
            if (id != cita.Id)
                return BadRequest();

            var actualizado = await _servicioCita.Actualizar(cita);
            if (!actualizado)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Eliminar(int id)
        {
            var eliminado = await _servicioCita.Eliminar(id);
            if (!eliminado)
                return NotFound();

            return NoContent();
        }
    }
}
