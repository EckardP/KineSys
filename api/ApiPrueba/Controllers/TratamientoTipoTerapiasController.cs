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
    public class TratamientoTipoTerapiasController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public TratamientoTipoTerapiasController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/TratamientoTipoTerapias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TratamientoTipoTerapia>>> GetTratamientoTipoTerapias()
        {
            return await _context.TratamientoTipoTerapias.ToListAsync();
        }

        // GET: api/TratamientoTipoTerapias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TratamientoTipoTerapia>> GetTratamientoTipoTerapia(int id)
        {
            var tratamientoTipoTerapia = await _context.TratamientoTipoTerapias.FindAsync(id);

            if (tratamientoTipoTerapia == null)
            {
                return NotFound();
            }

            return tratamientoTipoTerapia;
        }

        // PUT: api/TratamientoTipoTerapias/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTratamientoTipoTerapia(int id, TratamientoTipoTerapia tratamientoTipoTerapia)
        {
            if (id != tratamientoTipoTerapia.IdTratamientoTipoTerapia)
            {
                return BadRequest();
            }

            _context.Entry(tratamientoTipoTerapia).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TratamientoTipoTerapiaExists(id))
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

        // POST: api/TratamientoTipoTerapias
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TratamientoTipoTerapia>> PostTratamientoTipoTerapia(TratamientoTipoTerapia tratamientoTipoTerapia)
        {
            _context.TratamientoTipoTerapias.Add(tratamientoTipoTerapia);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTratamientoTipoTerapia", new { id = tratamientoTipoTerapia.IdTratamientoTipoTerapia }, tratamientoTipoTerapia);
        }

        // DELETE: api/TratamientoTipoTerapias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTratamientoTipoTerapia(int id)
        {
            var tratamientoTipoTerapia = await _context.TratamientoTipoTerapias.FindAsync(id);
            if (tratamientoTipoTerapia == null)
            {
                return NotFound();
            }

            _context.TratamientoTipoTerapias.Remove(tratamientoTipoTerapia);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TratamientoTipoTerapiaExists(int id)
        {
            return _context.TratamientoTipoTerapias.Any(e => e.IdTratamientoTipoTerapia == id);
        }
    }
}
