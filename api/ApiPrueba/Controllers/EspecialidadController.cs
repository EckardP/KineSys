using ApiPrueba.DTO;
using ApiPrueba.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ApiPrueba.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EspecialidadesController : ControllerBase
    {
        private readonly IServiceEspecialidad _servicioEspecialidad;

        public EspecialidadesController(IServiceEspecialidad servicioEspecialidad)
        {
            _servicioEspecialidad = servicioEspecialidad;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EspecialidadDTO>>> ObtenerTodas()
        {
            var especialidades = await _servicioEspecialidad.ObtenerTodas();
            return Ok(especialidades);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EspecialidadDTO>> ObtenerPorId(int id)
        {
            var especialidad = await _servicioEspecialidad.ObtenerPorId(id);
            if (especialidad == null)
                return NotFound();

            return Ok(especialidad);
        }

        [HttpPost]
        public async Task<ActionResult> Crear(EspecialidadDTO especialidad)
        {
            await _servicioEspecialidad.Crear(especialidad);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = especialidad.Id }, especialidad);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Actualizar(int id, EspecialidadDTO especialidad)
        {
            if (id != especialidad.Id)
                return BadRequest();

            var actualizado = await _servicioEspecialidad.Actualizar(especialidad);
            if (!actualizado)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Eliminar(int id)
        {
            var eliminado = await _servicioEspecialidad.Eliminar(id);
            if (!eliminado)
                return NotFound();

            return NoContent();
        }
    }
}
