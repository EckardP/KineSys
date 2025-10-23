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
    public class EvolucionPacientesController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public EvolucionPacientesController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/EvolucionPacientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EvolucionPaciente>>> GetEvolucionesPaciente()
        {
            return await _context.EvolucionesPaciente.ToListAsync();
        }

        // GET: api/EvolucionPacientes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EvolucionPaciente>> GetEvolucionPaciente(int id)
        {
            var evolucionPaciente = await _context.EvolucionesPaciente.FindAsync(id);

            if (evolucionPaciente == null)
            {
                return NotFound();
            }

            return evolucionPaciente;
        }

        // PUT: api/EvolucionPacientes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEvolucionPaciente(int id, EvolucionPaciente evolucionPaciente)
        {
            if (id != evolucionPaciente.IdEvolucion)
            {
                return BadRequest();
            }

            _context.Entry(evolucionPaciente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EvolucionPacienteExists(id))
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

        // POST: api/EvolucionPacientes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<EvolucionPaciente>> PostEvolucionPaciente(EvolucionPaciente evolucionPaciente)
        {
            _context.EvolucionesPaciente.Add(evolucionPaciente);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEvolucionPaciente", new { id = evolucionPaciente.IdEvolucion }, evolucionPaciente);
        }

        // DELETE: api/EvolucionPacientes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvolucionPaciente(int id)
        {
            var evolucionPaciente = await _context.EvolucionesPaciente.FindAsync(id);
            if (evolucionPaciente == null)
            {
                return NotFound();
            }

            _context.EvolucionesPaciente.Remove(evolucionPaciente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EvolucionPacienteExists(int id)
        {
            return _context.EvolucionesPaciente.Any(e => e.IdEvolucion == id);
        }
    }
}
