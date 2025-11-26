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
    public class TratamientoesController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public TratamientoesController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/Tratamientoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tratamiento>>> GetTratamientos()
        {
            return await _context.Tratamientos
                .Include(t => t.Especialidad)
                .Include(t => t.TratamientoEquipos)
                    .ThenInclude(te => te.Equipo)
                .ToListAsync();
        }

        // GET: api/Tratamientoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tratamiento>> GetTratamiento(int id)
        {
            var tratamiento = await _context.Tratamientos
                .Include(t => t.Especialidad)
                .Include(t => t.TratamientoEquipos)
                    .ThenInclude(te => te.Equipo)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tratamiento == null)
            {
                return NotFound();
            }

            return tratamiento;
        }

        // PUT: api/Tratamientoes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTratamiento(int id, Tratamiento tratamiento)
        {
            if (id != tratamiento.Id)
            {
                return BadRequest();
            }

            _context.Entry(tratamiento).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TratamientoExists(id))
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

        // POST: api/Tratamientoes
        [HttpPost]
        public async Task<ActionResult<Tratamiento>> PostTratamiento(Tratamiento tratamiento)
        {
            // Validar que el nombre no esté duplicado
            if (await _context.Tratamientos.AnyAsync(t => t.Nombre == tratamiento.Nombre))
            {
                return Conflict("Ya existe un tratamiento con ese nombre");
            }

            _context.Tratamientos.Add(tratamiento);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTratamiento", new { id = tratamiento.Id }, tratamiento);
        }

        // DELETE: api/Tratamientoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTratamiento(int id)
        {
            var tratamiento = await _context.Tratamientos.FindAsync(id);
            if (tratamiento == null)
            {
                return NotFound();
            }

            _context.Tratamientos.Remove(tratamiento);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ENDPOINT PARA AGREGAR EQUIPO A TRATAMIENTO
        [HttpPost("{id}/equipos")]
        public async Task<ActionResult> AgregarEquipoATratamiento(int id, [FromBody] AgregarEquipoRequest request)
        {
            var tratamiento = await _context.Tratamientos.FindAsync(id);
            if (tratamiento == null)
            {
                return NotFound("Tratamiento no encontrado");
            }

            var equipo = await _context.Equipos.FindAsync(request.IdEquipo);
            if (equipo == null)
            {
                return NotFound("Equipo no encontrado");
            }

            var tratamientoEquipo = new TratamientoEquipo
            {
                IdTratamiento = id,
                IdEquipo = request.IdEquipo,
                CantidadRequerida = request.CantidadRequerida,
                Notas = request.Notas
            };

            _context.TratamientoEquipos.Add(tratamientoEquipo);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // ENDPOINT PARA REMOVER EQUIPO DE TRATAMIENTO
        [HttpDelete("{id}/equipos/{idEquipo}")]
        public async Task<ActionResult> RemoverEquipoDeTratamiento(int id, int idEquipo)
        {
            var tratamientoEquipo = await _context.TratamientoEquipos
                .FirstOrDefaultAsync(te => te.IdTratamiento == id && te.IdEquipo == idEquipo);

            if (tratamientoEquipo == null)
            {
                return NotFound("Equipo no encontrado en este tratamiento");
            }

            _context.TratamientoEquipos.Remove(tratamientoEquipo);
            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool TratamientoExists(int id)
        {
            return _context.Tratamientos.Any(e => e.Id == id);
        }
    }

    // DTO para agregar equipo
    public class AgregarEquipoRequest
    {
        public int IdEquipo { get; set; }
        public int CantidadRequerida { get; set; } = 1;
        public string? Notas { get; set; }
    }
}