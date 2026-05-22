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
    public class ContactoEmergenciasController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public ContactoEmergenciasController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/ContactoEmergencias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContactoEmergencia>>> GetContactosEmergencia()
        {
            return await _context.ContactosEmergencia.ToListAsync();
        }

        // GET: api/ContactoEmergencias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ContactoEmergencia>> GetContactoEmergencia(int id)
        {
            var contactoEmergencia = await _context.ContactosEmergencia.FindAsync(id);

            if (contactoEmergencia == null)
            {
                return NotFound();
            }

            return contactoEmergencia;
        }

        // PUT: api/ContactoEmergencias/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContactoEmergencia(int id, ContactoEmergencia contactoEmergencia)
        {
            if (id != contactoEmergencia.IdContacto)
            {
                return BadRequest();
            }

            _context.Entry(contactoEmergencia).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactoEmergenciaExists(id))
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

        // POST: api/ContactoEmergencias
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ContactoEmergencia>> PostContactoEmergencia(ContactoEmergencia contactoEmergencia)
        {
            _context.ContactosEmergencia.Add(contactoEmergencia);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetContactoEmergencia", new { id = contactoEmergencia.IdContacto }, contactoEmergencia);
        }

        // DELETE: api/ContactoEmergencias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContactoEmergencia(int id)
        {
            var contactoEmergencia = await _context.ContactosEmergencia.FindAsync(id);
            if (contactoEmergencia == null)
            {
                return NotFound();
            }

            _context.ContactosEmergencia.Remove(contactoEmergencia);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ContactoEmergenciaExists(int id)
        {
            return _context.ContactosEmergencia.Any(e => e.IdContacto == id);
        }
    }
}
