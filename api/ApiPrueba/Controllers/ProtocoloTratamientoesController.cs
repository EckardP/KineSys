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
    public class ProtocoloTratamientoesController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public ProtocoloTratamientoesController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/ProtocoloTratamientoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProtocoloTratamiento>>> GetProtocoloTratamientos()
        {
            return await _context.ProtocoloTratamientos.ToListAsync();
        }

        // GET: api/ProtocoloTratamientoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProtocoloTratamiento>> GetProtocoloTratamiento(int id)
        {
            var protocoloTratamiento = await _context.ProtocoloTratamientos.FindAsync(id);

            if (protocoloTratamiento == null)
            {
                return NotFound();
            }

            return protocoloTratamiento;
        }

        // PUT: api/ProtocoloTratamientoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProtocoloTratamiento(int id, ProtocoloTratamiento protocoloTratamiento)
        {
            if (id != protocoloTratamiento.IdProtocolo)
            {
                return BadRequest();
            }

            _context.Entry(protocoloTratamiento).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProtocoloTratamientoExists(id))
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

        // POST: api/ProtocoloTratamientoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProtocoloTratamiento>> PostProtocoloTratamiento(ProtocoloTratamiento protocoloTratamiento)
        {
            _context.ProtocoloTratamientos.Add(protocoloTratamiento);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProtocoloTratamiento", new { id = protocoloTratamiento.IdProtocolo }, protocoloTratamiento);
        }

        // DELETE: api/ProtocoloTratamientoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProtocoloTratamiento(int id)
        {
            var protocoloTratamiento = await _context.ProtocoloTratamientos.FindAsync(id);
            if (protocoloTratamiento == null)
            {
                return NotFound();
            }

            _context.ProtocoloTratamientos.Remove(protocoloTratamiento);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProtocoloTratamientoExists(int id)
        {
            return _context.ProtocoloTratamientos.Any(e => e.IdProtocolo == id);
        }
    }
}
