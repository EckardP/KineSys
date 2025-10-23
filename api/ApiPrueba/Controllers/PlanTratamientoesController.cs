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
    public class PlanTratamientoesController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public PlanTratamientoesController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/PlanTratamientoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlanTratamiento>>> GetPlanTratamientos()
        {
            return await _context.PlanTratamientos.ToListAsync();
        }

        // GET: api/PlanTratamientoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PlanTratamiento>> GetPlanTratamiento(int id)
        {
            var planTratamiento = await _context.PlanTratamientos.FindAsync(id);

            if (planTratamiento == null)
            {
                return NotFound();
            }

            return planTratamiento;
        }

        // PUT: api/PlanTratamientoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPlanTratamiento(int id, PlanTratamiento planTratamiento)
        {
            if (id != planTratamiento.Id)
            {
                return BadRequest();
            }

            _context.Entry(planTratamiento).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlanTratamientoExists(id))
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

        // POST: api/PlanTratamientoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PlanTratamiento>> PostPlanTratamiento(PlanTratamiento planTratamiento)
        {
            _context.PlanTratamientos.Add(planTratamiento);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPlanTratamiento", new { id = planTratamiento.Id }, planTratamiento);
        }

        // DELETE: api/PlanTratamientoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlanTratamiento(int id)
        {
            var planTratamiento = await _context.PlanTratamientos.FindAsync(id);
            if (planTratamiento == null)
            {
                return NotFound();
            }

            _context.PlanTratamientos.Remove(planTratamiento);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PlanTratamientoExists(int id)
        {
            return _context.PlanTratamientos.Any(e => e.Id == id);
        }
    }
}
