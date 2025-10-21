using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ApiPrueba.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DisponibilidadesTerapeutaController : ControllerBase
    {
        private readonly IDisponibilidadTerapeutaService _service;
        public DisponibilidadesTerapeutaController(IDisponibilidadTerapeutaService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? terapeutaId) => Ok(await _service.GetAllAsync(terapeutaId));

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var r = await _service.GetByIdAsync(id);
            if (r == null) return NotFound();
            return Ok(r);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DisponibilidadTerapeuta model)
        {
            var created = await _service.CreateAsync(model);
            if (created == null) return BadRequest("Hora inicio debe ser menor que hora fin.");
            return CreatedAtAction(nameof(Get), new { id = created.IdDisponibilidad }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] DisponibilidadTerapeuta model)
        {
            if (id != model.IdDisponibilidad) return BadRequest();
            var updated = await _service.UpdateAsync(model);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _service.DeleteAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }
    }
}
