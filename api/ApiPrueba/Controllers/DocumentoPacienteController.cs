using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ApiPrueba.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentosPacienteController : ControllerBase
    {
        private readonly IDocumentoPacienteService _service;
        public DocumentosPacienteController(IDocumentoPacienteService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? pacienteId) => Ok(await _service.GetAllAsync(pacienteId));

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var r = await _service.GetByIdAsync(id);
            if (r == null) return NotFound();
            return Ok(r);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DocumentoPaciente model)
        {
            var created = await _service.CreateAsync(model);
            return CreatedAtAction(nameof(Get), new { id = created.IdDocumento }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] DocumentoPaciente model)
        {
            if (id != model.IdDocumento) return BadRequest();
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
