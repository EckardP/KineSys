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
    public class ContratoSeguroesController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public ContratoSeguroesController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/ContratoSeguroes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContratoSeguro>>> GetContratosSeguro()
        {
            return await _context.ContratosSeguro.ToListAsync();
        }

        // GET: api/ContratoSeguroes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ContratoSeguro>> GetContratoSeguro(int id)
        {
            var contratoSeguro = await _context.ContratosSeguro.FindAsync(id);

            if (contratoSeguro == null)
            {
                return NotFound();
            }

            return contratoSeguro;
        }

        // PUT: api/ContratoSeguroes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContratoSeguro(int id, ContratoSeguro contratoSeguro)
        {
            if (id != contratoSeguro.ContratoId)
            {
                return BadRequest();
            }

            _context.Entry(contratoSeguro).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContratoSeguroExists(id))
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

        // POST: api/ContratoSeguroes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ContratoSeguro>> PostContratoSeguro(ContratoSeguro contratoSeguro)
        {
            _context.ContratosSeguro.Add(contratoSeguro);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetContratoSeguro", new { id = contratoSeguro.ContratoId }, contratoSeguro);
        }

        // DELETE: api/ContratoSeguroes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContratoSeguro(int id)
        {
            var contratoSeguro = await _context.ContratosSeguro.FindAsync(id);
            if (contratoSeguro == null)
            {
                return NotFound();
            }

            _context.ContratosSeguro.Remove(contratoSeguro);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ContratoSeguroExists(int id)
        {
            return _context.ContratosSeguro.Any(e => e.ContratoId == id);
        }
    }
}
