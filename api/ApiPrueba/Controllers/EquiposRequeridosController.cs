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
    public class EquiposRequeridosController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public EquiposRequeridosController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/EquiposRequeridos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EquiposRequeridos>>> GetEquiposRequeridos()
        {
            return await _context.EquiposRequeridos.ToListAsync();
        }

        // GET: api/EquiposRequeridos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EquiposRequeridos>> GetEquiposRequeridos(int id)
        {
            var equiposRequeridos = await _context.EquiposRequeridos.FindAsync(id);

            if (equiposRequeridos == null)
            {
                return NotFound();
            }

            return equiposRequeridos;
        }

        // PUT: api/EquiposRequeridos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEquiposRequeridos(int id, EquiposRequeridos equiposRequeridos)
        {
            if (id != equiposRequeridos.IdEquipoRequerido)
            {
                return BadRequest();
            }

            _context.Entry(equiposRequeridos).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EquiposRequeridosExists(id))
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

        // POST: api/EquiposRequeridos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<EquiposRequeridos>> PostEquiposRequeridos(EquiposRequeridos equiposRequeridos)
        {
            _context.EquiposRequeridos.Add(equiposRequeridos);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEquiposRequeridos", new { id = equiposRequeridos.IdEquipoRequerido }, equiposRequeridos);
        }

        // DELETE: api/EquiposRequeridos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquiposRequeridos(int id)
        {
            var equiposRequeridos = await _context.EquiposRequeridos.FindAsync(id);
            if (equiposRequeridos == null)
            {
                return NotFound();
            }

            _context.EquiposRequeridos.Remove(equiposRequeridos);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EquiposRequeridosExists(int id)
        {
            return _context.EquiposRequeridos.Any(e => e.IdEquipoRequerido == id);
        }
    }
}
