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
    public class TratamientoProtocoloesController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public TratamientoProtocoloesController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/TratamientoProtocoloes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TratamientoProtocolo>>> GetTratamientoProtocolos()
        {
            return await _context.TratamientoProtocolos.ToListAsync();
        }

        // GET: api/TratamientoProtocoloes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TratamientoProtocolo>> GetTratamientoProtocolo(int id)
        {
            var tratamientoProtocolo = await _context.TratamientoProtocolos.FindAsync(id);

            if (tratamientoProtocolo == null)
            {
                return NotFound();
            }

            return tratamientoProtocolo;
        }

        // PUT: api/TratamientoProtocoloes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTratamientoProtocolo(int id, TratamientoProtocolo tratamientoProtocolo)
        {
            if (id != tratamientoProtocolo.IdTratamientoProtocolo)
            {
                return BadRequest();
            }

            _context.Entry(tratamientoProtocolo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TratamientoProtocoloExists(id))
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

        // POST: api/TratamientoProtocoloes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TratamientoProtocolo>> PostTratamientoProtocolo(TratamientoProtocolo tratamientoProtocolo)
        {
            _context.TratamientoProtocolos.Add(tratamientoProtocolo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTratamientoProtocolo", new { id = tratamientoProtocolo.IdTratamientoProtocolo }, tratamientoProtocolo);
        }

        // DELETE: api/TratamientoProtocoloes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTratamientoProtocolo(int id)
        {
            var tratamientoProtocolo = await _context.TratamientoProtocolos.FindAsync(id);
            if (tratamientoProtocolo == null)
            {
                return NotFound();
            }

            _context.TratamientoProtocolos.Remove(tratamientoProtocolo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TratamientoProtocoloExists(int id)
        {
            return _context.TratamientoProtocolos.Any(e => e.IdTratamientoProtocolo == id);
        }
    }
}
