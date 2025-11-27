using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiPrueba.Data;
using ApiPrueba.Models;

namespace ApiPrueba.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TerapeutaEspecialidadsController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public TerapeutaEspecialidadsController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/TerapeutaEspecialidads
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TerapeutaEspecialidad>>> GetTerapeutaEspecialidades()
        {
            return await _context.TerapeutaEspecialidades.ToListAsync();
        }

        // GET: api/TerapeutaEspecialidads/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TerapeutaEspecialidad>> GetTerapeutaEspecialidad(int id)
        {
            var terapeutaEspecialidad = await _context.TerapeutaEspecialidades.FindAsync(id);

            if (terapeutaEspecialidad == null)
            {
                return NotFound();
            }

            return terapeutaEspecialidad;
        }


        // GET: api/TerapeutaEspecialidads/por-terapeuta/{idTerapeuta}
        // GET: api/TerapeutaEspecialidads/por-terapeuta/{idTerapeuta}
        [HttpGet("por-terapeuta/{idTerapeuta}")]
        public async Task<ActionResult<IEnumerable<object>>> GetEspecialidadesPorTerapeuta(int idTerapeuta)
        {
            var especialidades = await _context.TerapeutaEspecialidades
                .Where(te => te.IdTerapeuta == idTerapeuta)
                .Include(te => te.Especialidad)
                .Select(te => new
                {
                    te.IdTerapeutaEspecialidad,
                    te.IdTerapeuta,
                    te.IdEspecialidad,
                    Nombre = te.Especialidad.Nombre, // ← Incluir el nombre aquí
                    te.FechaCertificacion,
                    te.NumeroCertificado,
                    te.EsPrincipal
                })
                .ToListAsync();

            return Ok(especialidades);
        }
        // GET: api/TerapeutaEspecialidads/por-terapeuta/{idTerapeuta}/principal
        [HttpGet("por-terapeuta/{idTerapeuta}/principal")]
        public async Task<ActionResult<TerapeutaEspecialidad>> GetEspecialidadPrincipalPorTerapeuta(int idTerapeuta)
        {
            var especialidadPrincipal = await _context.TerapeutaEspecialidades
                .Where(te => te.IdTerapeuta == idTerapeuta && te.EsPrincipal)
                .Include(te => te.Especialidad)
                .FirstOrDefaultAsync();

            if (especialidadPrincipal == null)
            {
                return NotFound($"No se encontró especialidad principal para el terapeuta con ID {idTerapeuta}");
            }

            return especialidadPrincipal;
        }

        // PUT: api/TerapeutaEspecialidads/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTerapeutaEspecialidad(int id, TerapeutaEspecialidad terapeutaEspecialidad)
        {
            if (id != terapeutaEspecialidad.IdTerapeutaEspecialidad)
            {
                return BadRequest();
            }

            _context.Entry(terapeutaEspecialidad).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TerapeutaEspecialidadExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TerapeutaEspecialidads
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TerapeutaEspecialidad>> PostTerapeutaEspecialidad(TerapeutaEspecialidad terapeutaEspecialidad)
        {
            _context.TerapeutaEspecialidades.Add(terapeutaEspecialidad);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTerapeutaEspecialidad", new { id = terapeutaEspecialidad.IdTerapeutaEspecialidad }, terapeutaEspecialidad);
        }

        // DELETE: api/TerapeutaEspecialidads/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTerapeutaEspecialidad(int id)
        {
            var terapeutaEspecialidad = await _context.TerapeutaEspecialidades.FindAsync(id);
            if (terapeutaEspecialidad == null)
            {
                return NotFound();
            }

            _context.TerapeutaEspecialidades.Remove(terapeutaEspecialidad);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TerapeutaEspecialidadExists(int id)
        {
            return _context.TerapeutaEspecialidades.Any(e => e.IdTerapeutaEspecialidad == id);
        }
    }
}