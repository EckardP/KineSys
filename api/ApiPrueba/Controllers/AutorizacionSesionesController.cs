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
    public class AutorizacionSesionesController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public AutorizacionSesionesController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/AutorizacionSesiones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AutorizacionSesiones>>> GetAutorizacionSesiones()
        {
            return await _context.AutorizacionSesiones.ToListAsync();
        }

        // GET: api/AutorizacionSesiones/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AutorizacionSesiones>> GetAutorizacionSesiones(int id)
        {
            var autorizacionSesiones = await _context.AutorizacionSesiones.FindAsync(id);

            if (autorizacionSesiones == null)
            {
                return NotFound();
            }

            return autorizacionSesiones;
        }

        // PUT: api/AutorizacionSesiones/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAutorizacionSesiones(int id, AutorizacionSesiones autorizacionSesiones)
        {
            if (id != autorizacionSesiones.IdAutorizacion)
            {
                return BadRequest();
            }

            _context.Entry(autorizacionSesiones).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AutorizacionSesionesExists(id))
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

        // POST: api/AutorizacionSesiones
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AutorizacionSesiones>> PostAutorizacionSesiones(AutorizacionSesiones autorizacionSesiones)
        {
            _context.AutorizacionSesiones.Add(autorizacionSesiones);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAutorizacionSesiones", new { id = autorizacionSesiones.IdAutorizacion }, autorizacionSesiones);
        }

        // DELETE: api/AutorizacionSesiones/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAutorizacionSesiones(int id)
        {
            var autorizacionSesiones = await _context.AutorizacionSesiones.FindAsync(id);
            if (autorizacionSesiones == null)
            {
                return NotFound();
            }

            _context.AutorizacionSesiones.Remove(autorizacionSesiones);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AutorizacionSesionesExists(int id)
        {
            return _context.AutorizacionSesiones.Any(e => e.IdAutorizacion == id);
        }
    }
}
