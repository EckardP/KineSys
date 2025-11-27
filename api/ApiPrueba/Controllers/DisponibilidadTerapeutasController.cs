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
    public class DisponibilidadTerapeutasController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public DisponibilidadTerapeutasController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/DisponibilidadTerapeutas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DisponibilidadTerapeuta>>> GetDisponibilidadesTerapeutas()
        {
            return await _context.DisponibilidadesTerapeutas.ToListAsync();
        }

        // GET: api/DisponibilidadTerapeutas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DisponibilidadTerapeuta>> GetDisponibilidadTerapeuta(int id)
        {
            var disponibilidadTerapeuta = await _context.DisponibilidadesTerapeutas.FindAsync(id);

            if (disponibilidadTerapeuta == null)
            {
                return NotFound();
            }

            return disponibilidadTerapeuta;
        }

        // GET: api/DisponibilidadTerapeutas/por-terapeuta/{idTerapeuta}
        [HttpGet("por-terapeuta/{idTerapeuta}")]
        public async Task<ActionResult<IEnumerable<DisponibilidadTerapeuta>>> GetDisponibilidadPorTerapeuta(int idTerapeuta)
        {
            var disponibilidades = await _context.DisponibilidadesTerapeutas
                .Where(d => d.IdTerapeuta == idTerapeuta)
                .ToListAsync();

            if (disponibilidades == null || !disponibilidades.Any())
            {
                return NotFound($"No se encontraron disponibilidades para el terapeuta con ID {idTerapeuta}");
            }

            return disponibilidades;
        }

        // PUT: api/DisponibilidadTerapeutas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDisponibilidadTerapeuta(int id, DisponibilidadTerapeuta disponibilidadTerapeuta)
        {
            if (id != disponibilidadTerapeuta.IdDisponibilidad)
            {
                return BadRequest();
            }

            _context.Entry(disponibilidadTerapeuta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DisponibilidadTerapeutaExists(id))
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

        // POST: api/DisponibilidadTerapeutas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DisponibilidadTerapeuta>> PostDisponibilidadTerapeuta(DisponibilidadTerapeuta disponibilidadTerapeuta)
        {
            _context.DisponibilidadesTerapeutas.Add(disponibilidadTerapeuta);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDisponibilidadTerapeuta", new { id = disponibilidadTerapeuta.IdDisponibilidad }, disponibilidadTerapeuta);
        }

        // DELETE: api/DisponibilidadTerapeutas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDisponibilidadTerapeuta(int id)
        {
            var disponibilidadTerapeuta = await _context.DisponibilidadesTerapeutas.FindAsync(id);
            if (disponibilidadTerapeuta == null)
            {
                return NotFound();
            }

            _context.DisponibilidadesTerapeutas.Remove(disponibilidadTerapeuta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DisponibilidadTerapeutaExists(int id)
        {
            return _context.DisponibilidadesTerapeutas.Any(e => e.IdDisponibilidad == id);
        }
    }
}