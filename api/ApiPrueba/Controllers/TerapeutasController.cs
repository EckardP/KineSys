using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiPrueba.Data;
using ApiPrueba.Models;
using Microsoft.AspNetCore.Authorization;

namespace ApiPrueba.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TerapeutasController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public TerapeutasController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/Terapeutas
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Terapeuta>>> GetTerapeutas()
        {
            return await _context.Terapeutas.ToListAsync();
        }

        // GET: api/Terapeutas/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Terapeuta>> GetTerapeuta(int id)
        {
            var terapeuta = await _context.Terapeutas.FindAsync(id);

            if (terapeuta == null)
            {
                return NotFound();
            }

            return terapeuta;
        }

        // PUT: api/Terapeutas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTerapeuta(int id, Terapeuta terapeuta)
        {
            if (id != terapeuta.Id)
            {
                return BadRequest();
            }

            var existeDocumento = await _context.Persona.AnyAsync(p => p.DocumentoIdentidad == terapeuta.DocumentoIdentidad && p.Id != id);

            if (existeDocumento)
            {
                return Conflict(new
                {
                    message = "Ya existe una persona registrada con ese documento de identidad.",
                    campo = "documentoIdentidad",
                    valor = terapeuta.DocumentoIdentidad
                });
            }

                _context.Entry(terapeuta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TerapeutaExists(id))
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

        // POST: api/Terapeutas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Terapeuta>> PostTerapeuta(Terapeuta terapeuta)
        {
            var existeDocumento = await _context.Terapeutas
            .AnyAsync(p => p.DocumentoIdentidad == terapeuta.DocumentoIdentidad);

            if (existeDocumento)
            {
                return Conflict(new
                {
                    message = "Ya existe una persona registrada con ese documento de identidad.",
                    campo = "documentoIdentidad",
                    valor = terapeuta.DocumentoIdentidad
                });
            }
            _context.Terapeutas.Add(terapeuta);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTerapeuta", new { id = terapeuta.Id }, terapeuta);
        }

        // DELETE: api/Terapeutas/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTerapeuta(int id)
        {
            var terapeuta = await _context.Terapeutas.FindAsync(id);
            if (terapeuta == null)
            {
                return NotFound();
            }

            _context.Terapeutas.Remove(terapeuta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TerapeutaExists(int id)
        {
            return _context.Terapeutas.Any(e => e.Id == id);
        }
    }
}
