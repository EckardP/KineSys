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
    public class ProtocoloTipoTerapiasController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public ProtocoloTipoTerapiasController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/ProtocoloTipoTerapias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProtocoloTipoTerapia>>> GetProtocoloTipoTerapias()
        {
            return await _context.ProtocoloTipoTerapias.ToListAsync();
        }

        // GET: api/ProtocoloTipoTerapias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProtocoloTipoTerapia>> GetProtocoloTipoTerapia(int id)
        {
            var protocoloTipoTerapia = await _context.ProtocoloTipoTerapias.FindAsync(id);

            if (protocoloTipoTerapia == null)
            {
                return NotFound();
            }

            return protocoloTipoTerapia;
        }

        // PUT: api/ProtocoloTipoTerapias/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProtocoloTipoTerapia(int id, ProtocoloTipoTerapia protocoloTipoTerapia)
        {
            if (id != protocoloTipoTerapia.IdProtocoloTipoTerapia)
            {
                return BadRequest();
            }

            _context.Entry(protocoloTipoTerapia).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProtocoloTipoTerapiaExists(id))
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

        // POST: api/ProtocoloTipoTerapias
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProtocoloTipoTerapia>> PostProtocoloTipoTerapia(ProtocoloTipoTerapia protocoloTipoTerapia)
        {
            _context.ProtocoloTipoTerapias.Add(protocoloTipoTerapia);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProtocoloTipoTerapia", new { id = protocoloTipoTerapia.IdProtocoloTipoTerapia }, protocoloTipoTerapia);
        }

        // DELETE: api/ProtocoloTipoTerapias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProtocoloTipoTerapia(int id)
        {
            var protocoloTipoTerapia = await _context.ProtocoloTipoTerapias.FindAsync(id);
            if (protocoloTipoTerapia == null)
            {
                return NotFound();
            }

            _context.ProtocoloTipoTerapias.Remove(protocoloTipoTerapia);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProtocoloTipoTerapiaExists(int id)
        {
            return _context.ProtocoloTipoTerapias.Any(e => e.IdProtocoloTipoTerapia == id);
        }
    }
}
