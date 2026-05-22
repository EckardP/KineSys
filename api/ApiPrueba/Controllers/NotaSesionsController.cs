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
    public class NotaSesionsController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public NotaSesionsController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/NotaSesions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotaSesion>>> GetNotasSesion()
        {
            return await _context.NotasSesion.ToListAsync();
        }

        // GET: api/NotaSesions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NotaSesion>> GetNotaSesion(int id)
        {
            var notaSesion = await _context.NotasSesion.FindAsync(id);

            if (notaSesion == null)
            {
                return NotFound();
            }

            return notaSesion;
        }

        // PUT: api/NotaSesions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNotaSesion(int id, NotaSesion notaSesion)
        {
            if (id != notaSesion.IdNota)
            {
                return BadRequest();
            }

            _context.Entry(notaSesion).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NotaSesionExists(id))
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

        // POST: api/NotaSesions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<NotaSesion>> PostNotaSesion(NotaSesion notaSesion)
        {
            _context.NotasSesion.Add(notaSesion);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNotaSesion", new { id = notaSesion.IdNota }, notaSesion);
        }

        // DELETE: api/NotaSesions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotaSesion(int id)
        {
            var notaSesion = await _context.NotasSesion.FindAsync(id);
            if (notaSesion == null)
            {
                return NotFound();
            }

            _context.NotasSesion.Remove(notaSesion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NotaSesionExists(int id)
        {
            return _context.NotasSesion.Any(e => e.IdNota == id);
        }
    }
}
