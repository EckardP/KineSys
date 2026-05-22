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
    public class EPSController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public EPSController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/EPS
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EPS>>> GetEpss()
        {
            return await _context.Epss.ToListAsync();
        }

        // GET: api/EPS/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EPS>> GetEPS(int id)
        {
            var ePS = await _context.Epss.FindAsync(id);

            if (ePS == null)
            {
                return NotFound();
            }

            return ePS;
        }

        // PUT: api/EPS/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEPS(int id, EPS ePS)
        {
            if (id != ePS.EPSId)
            {
                return BadRequest();
            }

            _context.Entry(ePS).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EPSExists(id))
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

        // POST: api/EPS
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<EPS>> PostEPS(EPS ePS)
        {
            _context.Epss.Add(ePS);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEPS", new { id = ePS.EPSId }, ePS);
        }

        // DELETE: api/EPS/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEPS(int id)
        {
            var ePS = await _context.Epss.FindAsync(id);
            if (ePS == null)
            {
                return NotFound();
            }

            _context.Epss.Remove(ePS);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EPSExists(int id)
        {
            return _context.Epss.Any(e => e.EPSId == id);
        }
    }
}
