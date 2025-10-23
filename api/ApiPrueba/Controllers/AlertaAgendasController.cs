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
    public class AlertaAgendasController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public AlertaAgendasController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/AlertaAgendas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AlertaAgenda>>> GetAlertasAgenda()
        {
            return await _context.AlertasAgenda.ToListAsync();
        }

        // GET: api/AlertaAgendas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AlertaAgenda>> GetAlertaAgenda(int id)
        {
            var alertaAgenda = await _context.AlertasAgenda.FindAsync(id);

            if (alertaAgenda == null)
            {
                return NotFound();
            }

            return alertaAgenda;
        }

        // PUT: api/AlertaAgendas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAlertaAgenda(int id, AlertaAgenda alertaAgenda)
        {
            if (id != alertaAgenda.IdAlerta)
            {
                return BadRequest();
            }

            _context.Entry(alertaAgenda).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AlertaAgendaExists(id))
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

        // POST: api/AlertaAgendas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AlertaAgenda>> PostAlertaAgenda(AlertaAgenda alertaAgenda)
        {
            _context.AlertasAgenda.Add(alertaAgenda);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAlertaAgenda", new { id = alertaAgenda.IdAlerta }, alertaAgenda);
        }

        // DELETE: api/AlertaAgendas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlertaAgenda(int id)
        {
            var alertaAgenda = await _context.AlertasAgenda.FindAsync(id);
            if (alertaAgenda == null)
            {
                return NotFound();
            }

            _context.AlertasAgenda.Remove(alertaAgenda);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AlertaAgendaExists(int id)
        {
            return _context.AlertasAgenda.Any(e => e.IdAlerta == id);
        }
    }
}
