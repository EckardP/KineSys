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
    public class SeguroMedicoesController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public SeguroMedicoesController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/SeguroMedicoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SeguroMedico>>> GetSegurosMedicos()
        {
            return await _context.SegurosMedicos.ToListAsync();
        }

        // GET: api/SeguroMedicoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SeguroMedico>> GetSeguroMedico(int id)
        {
            var seguroMedico = await _context.SegurosMedicos.FindAsync(id);

            if (seguroMedico == null)
            {
                return NotFound();
            }

            return seguroMedico;
        }

        // PUT: api/SeguroMedicoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSeguroMedico(int id, SeguroMedico seguroMedico)
        {
            if (id != seguroMedico.IdSeguro)
            {
                return BadRequest();
            }

            _context.Entry(seguroMedico).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeguroMedicoExists(id))
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

        // POST: api/SeguroMedicoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SeguroMedico>> PostSeguroMedico(SeguroMedico seguroMedico)
        {
            _context.SegurosMedicos.Add(seguroMedico);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSeguroMedico", new { id = seguroMedico.IdSeguro }, seguroMedico);
        }

        // DELETE: api/SeguroMedicoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSeguroMedico(int id)
        {
            var seguroMedico = await _context.SegurosMedicos.FindAsync(id);
            if (seguroMedico == null)
            {
                return NotFound();
            }

            _context.SegurosMedicos.Remove(seguroMedico);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SeguroMedicoExists(int id)
        {
            return _context.SegurosMedicos.Any(e => e.IdSeguro == id);
        }
    }
}
