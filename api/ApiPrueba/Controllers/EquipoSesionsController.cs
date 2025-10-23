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
    public class EquipoSesionsController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public EquipoSesionsController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/EquipoSesions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EquipoSesion>>> GetEquiposSesion()
        {
            return await _context.EquiposSesion.ToListAsync();
        }

        // GET: api/EquipoSesions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EquipoSesion>> GetEquipoSesion(int id)
        {
            var equipoSesion = await _context.EquiposSesion.FindAsync(id);

            if (equipoSesion == null)
            {
                return NotFound();
            }

            return equipoSesion;
        }

        // PUT: api/EquipoSesions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEquipoSesion(int id, EquipoSesion equipoSesion)
        {
            if (id != equipoSesion.IdEquipoSesion)
            {
                return BadRequest();
            }

            _context.Entry(equipoSesion).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EquipoSesionExists(id))
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

        // POST: api/EquipoSesions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<EquipoSesion>> PostEquipoSesion(EquipoSesion equipoSesion)
        {
            _context.EquiposSesion.Add(equipoSesion);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEquipoSesion", new { id = equipoSesion.IdEquipoSesion }, equipoSesion);
        }

        // DELETE: api/EquipoSesions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipoSesion(int id)
        {
            var equipoSesion = await _context.EquiposSesion.FindAsync(id);
            if (equipoSesion == null)
            {
                return NotFound();
            }

            _context.EquiposSesion.Remove(equipoSesion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EquipoSesionExists(int id)
        {
            return _context.EquiposSesion.Any(e => e.IdEquipoSesion == id);
        }
    }
}
