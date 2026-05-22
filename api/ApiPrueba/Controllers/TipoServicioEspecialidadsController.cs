using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ApiPrueba.Data;
using ApiPrueba.Models;

namespace ApiPrueba.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TipoServicioEspecialidadsController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public TipoServicioEspecialidadsController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/TipoServicioEspecialidads
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TipoServicioEspecialidad>>> GetTipoServicioEspecialidad()
        {
            return await _context.TipoServicioEspecialidad.ToListAsync();
        }

        // GET: api/TipoServicioEspecialidads/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TipoServicioEspecialidad>> GetTipoServicioEspecialidad(int id)
        {
            var tipoServicioEspecialidad = await _context.TipoServicioEspecialidad.FindAsync(id);

            if (tipoServicioEspecialidad == null)
            {
                return NotFound();
            }

            return tipoServicioEspecialidad;
        }

        // PUT: api/TipoServicioEspecialidads/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTipoServicioEspecialidad(int id, TipoServicioEspecialidad tipoServicioEspecialidad)
        {
            if (id != tipoServicioEspecialidad.IdTipoServicioEspecialidad)
            {
                return BadRequest();
            }

            _context.Entry(tipoServicioEspecialidad).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TipoServicioEspecialidadExists(id))
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

        // POST: api/TipoServicioEspecialidads
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TipoServicioEspecialidad>> PostTipoServicioEspecialidad(TipoServicioEspecialidad tipoServicioEspecialidad)
        {
            _context.TipoServicioEspecialidad.Add(tipoServicioEspecialidad);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTipoServicioEspecialidad", new { id = tipoServicioEspecialidad.IdTipoServicioEspecialidad }, tipoServicioEspecialidad);
        }

        // DELETE: api/TipoServicioEspecialidads/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTipoServicioEspecialidad(int id)
        {
            var tipoServicioEspecialidad = await _context.TipoServicioEspecialidad.FindAsync(id);
            if (tipoServicioEspecialidad == null)
            {
                return NotFound();
            }

            _context.TipoServicioEspecialidad.Remove(tipoServicioEspecialidad);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TipoServicioEspecialidadExists(int id)
        {
            return _context.TipoServicioEspecialidad.Any(e => e.IdTipoServicioEspecialidad == id);
        }
    }
}
