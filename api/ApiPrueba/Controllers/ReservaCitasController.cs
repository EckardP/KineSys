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
    public class ReservaCitasController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public ReservaCitasController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/ReservaCitas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReservaCita>>> GetReservasCita()
        {
            return await _context.ReservasCita.ToListAsync();
        }

        // GET: api/ReservaCitas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReservaCita>> GetReservaCita(int id)
        {
            var reservaCita = await _context.ReservasCita.FindAsync(id);

            if (reservaCita == null)
            {
                return NotFound();
            }

            return reservaCita;
        }

        // PUT: api/ReservaCitas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReservaCita(int id, ReservaCita reservaCita)
        {
            if (id != reservaCita.IdReserva)
            {
                return BadRequest();
            }

            _context.Entry(reservaCita).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReservaCitaExists(id))
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

        // POST: api/ReservaCitas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ReservaCita>> PostReservaCita(ReservaCita reservaCita)
        {
            _context.ReservasCita.Add(reservaCita);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReservaCita", new { id = reservaCita.IdReserva }, reservaCita);
        }

        // DELETE: api/ReservaCitas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservaCita(int id)
        {
            var reservaCita = await _context.ReservasCita.FindAsync(id);
            if (reservaCita == null)
            {
                return NotFound();
            }

            _context.ReservasCita.Remove(reservaCita);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReservaCitaExists(int id)
        {
            return _context.ReservasCita.Any(e => e.IdReserva == id);
        }
    }
}
