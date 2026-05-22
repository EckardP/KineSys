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
using ApiPrueba.DTOs;

namespace ApiPrueba.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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
        public async Task<ActionResult<Tratamiento>> PutTratamiento(int id, TratamientoCreateDto tratamientoDto)
        {
            try
            {
                // Verificar si el tratamiento existe
                var tratamientoExistente = await _context.Tratamientos
                    .Include(t => t.TratamientoEquipos)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (tratamientoExistente == null)
                {
                    return NotFound("Tratamiento no encontrado");
                }

                // Actualizar propiedades básicas del tratamiento
                tratamientoExistente.Nombre = tratamientoDto.Nombre;
                tratamientoExistente.Descripcion = tratamientoDto.Descripcion;
                tratamientoExistente.DuracionMinutos = tratamientoDto.DuracionMinutos;
                tratamientoExistente.SesionesRecomendadas = tratamientoDto.SesionesRecomendadas;
                tratamientoExistente.FrecuenciaRecomendada = tratamientoDto.FrecuenciaRecomendada;
                tratamientoExistente.CostoBase = tratamientoDto.CostoBase;
                tratamientoExistente.Indicaciones = tratamientoDto.Indicaciones;
                tratamientoExistente.Contraindicaciones = tratamientoDto.Contraindicaciones;
                tratamientoExistente.Activo = tratamientoDto.Activo;
                tratamientoExistente.IdEspecialidad = tratamientoDto.IdEspecialidad;
                tratamientoExistente.IdPaciente = tratamientoDto.IdPaciente;
                tratamientoExistente.IdTerapeuta = tratamientoDto.IdTerapeuta;

                // ?? ACTUALIZAR EQUIPOS - Eliminar equipos existentes
                _context.TratamientoEquipos.RemoveRange(tratamientoExistente.TratamientoEquipos);

                // ?? AGREGAR NUEVOS EQUIPOS si vienen en la request
                if (tratamientoDto.TratamientoEquipos != null && tratamientoDto.TratamientoEquipos.Any())
                {
                    foreach (var equipoDto in tratamientoDto.TratamientoEquipos)
                    {
                        // Validar que el equipo existe
                        var equipoExiste = await _context.Equipos.AnyAsync(e => e.IdEquipo == equipoDto.IdEquipo);
                        if (!equipoExiste)
                        {
                            return BadRequest($"El equipo con ID {equipoDto.IdEquipo} no existe");
                        }

                        var nuevoTratamientoEquipo = new TratamientoEquipo
                        {
                            IdTratamiento = id,
                            IdEquipo = equipoDto.IdEquipo,
                            CantidadRequerida = equipoDto.CantidadRequerida
                        };
                        _context.TratamientoEquipos.Add(nuevoTratamientoEquipo);
                    }
                }

                await _context.SaveChangesAsync();

                // Cargar el tratamiento actualizado con relaciones
                var tratamientoActualizado = await _context.Tratamientos
                    .Include(t => t.Especialidad)
                    .Include(t => t.TratamientoEquipos)
                        .ThenInclude(te => te.Equipo)
                    .FirstOrDefaultAsync(t => t.Id == id);

                return Ok(tratamientoActualizado);
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
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // POST: api/Tratamientoes - CORREGIDO CON DTO
        [HttpPost]
        public async Task<ActionResult<Tratamiento>> PostTratamiento(TratamientoCreateDto tratamientoDto)
        {
            try
            {
                // Validar que el nombre no esté duplicado
                if (await _context.Tratamientos.AnyAsync(t => t.Nombre == tratamientoDto.Nombre))
                {
                    return Conflict("Ya existe un tratamiento con ese nombre");
                }

                // ?? CREAR EL TRATAMIENTO SIN LOS EQUIPOS
                var tratamiento = new Tratamiento
                {
                    Nombre = tratamientoDto.Nombre,
                    Descripcion = tratamientoDto.Descripcion,
                    DuracionMinutos = tratamientoDto.DuracionMinutos,
                    SesionesRecomendadas = tratamientoDto.SesionesRecomendadas,
                    FrecuenciaRecomendada = tratamientoDto.FrecuenciaRecomendada,
                    CostoBase = tratamientoDto.CostoBase,
                    Indicaciones = tratamientoDto.Indicaciones,
                    Contraindicaciones = tratamientoDto.Contraindicaciones,
                    Activo = tratamientoDto.Activo,
                    IdEspecialidad = tratamientoDto.IdEspecialidad,
                    IdPaciente = tratamientoDto.IdPaciente,
                    IdTerapeuta = tratamientoDto.IdTerapeuta
                };

                _context.Tratamientos.Add(tratamiento);
                await _context.SaveChangesAsync();

                // ?? AGREGAR LOS EQUIPOS SI EXISTEN
                if (tratamientoDto.TratamientoEquipos != null && tratamientoDto.TratamientoEquipos.Any())
                {
                    foreach (var equipoDto in tratamientoDto.TratamientoEquipos)
                    {
                        // Validar que el equipo existe
                        var equipoExiste = await _context.Equipos.AnyAsync(e => e.IdEquipo == equipoDto.IdEquipo);
                        if (!equipoExiste)
                        {
                            // Opcional: eliminar el tratamiento recién creado si hay error
                            _context.Tratamientos.Remove(tratamiento);
                            await _context.SaveChangesAsync();
                            return BadRequest($"El equipo con ID {equipoDto.IdEquipo} no existe");
                        }

                        var tratamientoEquipo = new TratamientoEquipo
                        {
                            IdTratamiento = tratamiento.Id,
                            IdEquipo = equipoDto.IdEquipo,
                            CantidadRequerida = equipoDto.CantidadRequerida
                        };
                        _context.TratamientoEquipos.Add(tratamientoEquipo);
                    }
                    await _context.SaveChangesAsync();
                }

                // Cargar el tratamiento completo con relaciones
                var tratamientoCompleto = await _context.Tratamientos
                    .Include(t => t.Especialidad)
                    .Include(t => t.TratamientoEquipos)
                        .ThenInclude(te => te.Equipo)
                    .FirstOrDefaultAsync(t => t.Id == tratamiento.Id);

                return CreatedAtAction("GetTratamiento", new { id = tratamiento.Id }, tratamientoCompleto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
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
                CantidadRequerida = request.CantidadRequerida
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
    }
}