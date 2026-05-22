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
    public class DiagnosticoController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public DiagnosticoController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/Diagnostico
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Diagnostico>>> GetDiagnosticos()
        {
            return await _context.Diagnosticos.ToListAsync();
        }

        // GET: api/Diagnostico/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Diagnostico>> GetDiagnostico(int id)
        {
            var diagnostico = await _context.Diagnosticos.FindAsync(id);

            if (diagnostico == null)
            {
                return NotFound();
            }

            return diagnostico;
        }

        // PUT: api/Diagnostico/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDiagnostico(int id, Diagnostico diagnostico)
        {
            if (id != diagnostico.IdDiagnostico)
            {
                return BadRequest();
            }

            _context.Entry(diagnostico).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DiagnosticoExists(id))
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

        // POST: api/Diagnostico
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Diagnostico>> PostDiagnostico(Diagnostico diagnostico)
        {
            _context.Diagnosticos.Add(diagnostico);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDiagnostico", new { id = diagnostico.IdDiagnostico }, diagnostico);
        }

        // DELETE: api/Diagnostico/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDiagnostico(int id)
        {
            var diagnostico = await _context.Diagnosticos.FindAsync(id);
            if (diagnostico == null)
            {
                return NotFound();
            }

            _context.Diagnosticos.Remove(diagnostico);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DiagnosticoExists(int id)
        {
            return _context.Diagnosticos.Any(e => e.IdDiagnostico == id);
        }
    }
}
