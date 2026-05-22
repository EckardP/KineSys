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
    public class TipoTerapiasController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public TipoTerapiasController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/TipoTerapias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TipoTerapia>>> GetTipoTerapias()
        {
            return await _context.TipoTerapias.ToListAsync();
        }

        // GET: api/TipoTerapias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TipoTerapia>> GetTipoTerapia(int id)
        {
            var tipoTerapia = await _context.TipoTerapias.FindAsync(id);

            if (tipoTerapia == null)
            {
                return NotFound();
            }

            return tipoTerapia;
        }

        // PUT: api/TipoTerapias/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTipoTerapia(int id, TipoTerapia tipoTerapia)
        {
            if (id != tipoTerapia.IdTipoTerapia)
            {
                return BadRequest();
            }

            _context.Entry(tipoTerapia).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TipoTerapiaExists(id))
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

        // POST: api/TipoTerapias
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TipoTerapia>> PostTipoTerapia(TipoTerapia tipoTerapia)
        {
            _context.TipoTerapias.Add(tipoTerapia);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTipoTerapia", new { id = tipoTerapia.IdTipoTerapia }, tipoTerapia);
        }

        // DELETE: api/TipoTerapias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTipoTerapia(int id)
        {
            var tipoTerapia = await _context.TipoTerapias.FindAsync(id);
            if (tipoTerapia == null)
            {
                return NotFound();
            }

            _context.TipoTerapias.Remove(tipoTerapia);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TipoTerapiaExists(int id)
        {
            return _context.TipoTerapias.Any(e => e.IdTipoTerapia == id);
        }
    }
}
