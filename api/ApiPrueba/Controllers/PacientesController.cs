using ApiPrueba.data;
using ApiPrueba.DTO;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces.ApiPrueba.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PacientesController : ControllerBase
    {
        private readonly IServicioPaciente _servicioPaciente;

        public PacientesController(IServicioPaciente servicioPaciente)
        {
            _servicioPaciente = servicioPaciente;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PacienteDTO>>> ObtenerTodos()
        {
            var pacientes = await _servicioPaciente.ObtenerTodos();
            return Ok(pacientes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PacienteDTO>> ObtenerPorId(int id)
        {
            var paciente = await _servicioPaciente.ObtenerPorId(id);
            if (paciente == null)
                return NotFound();
            return Ok(paciente);
        }

        [HttpPost]
        public async Task<ActionResult> Crear(PacienteDTO paciente)
        {
            await _servicioPaciente.Crear(paciente);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = paciente.Id }, paciente);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Actualizar(int id, PacienteDTO paciente)
        {
            if (id != paciente.Id)
                return BadRequest();

            var actualizado = await _servicioPaciente.Actualizar(paciente);
            if (!actualizado)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Eliminar(int id)
        {
            var eliminado = await _servicioPaciente.Eliminar(id);
            if (!eliminado)
                return NotFound();

            return NoContent();
        }
    }
}
