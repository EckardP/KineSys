using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiPrueba.Data;
using ApiPrueba.Models;
using ApiPrueba.Services;
using ApiPrueba.DTOs;

namespace ApiPrueba.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacturasController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;
        private readonly FacturaService _facturaService;

        public FacturasController(ClinicaFisioterapiaBD context, FacturaService facturaService)
        {
            _context = context;
            _facturaService = facturaService;
        }

        // GET: api/Facturas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Factura>>> GetFactura()
        {
            return await _context.Factura.ToListAsync();
        }

        // GET: api/Facturas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Factura>> GetFactura(int id)
        {
            var factura = await _facturaService.ObtenerFacturaDetalladaAsync(id);

            if (factura == null)
            {
                return NotFound();
            }

            return factura;
        }


        // GET: api/Facturas/Cita/5/Costo
        [HttpGet("Cita/{idCita}/Costo")]
        public async Task<ActionResult<decimal>> GetCostoCita(int idCita)
        {
            try
            {
                var costo = await _facturaService.CalcularCostoCitaAsync(idCita);
                return Ok(new { IdCita = idCita, Costo = costo });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // GET: api/Facturas/Tratamiento/5/Costo
        [HttpGet("Tratamiento/{idTratamiento}/Costo")]
        public async Task<ActionResult<decimal>> GetCostoTratamiento(int idTratamiento)
        {
            try
            {
                var costo = await _facturaService.CalcularCostoTratamientoAsync(idTratamiento);
                return Ok(new { IdTratamiento = idTratamiento, Costo = costo });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // GET: api/Facturas/Paciente/5/Citas/Total
        [HttpGet("Paciente/{idPaciente}/Citas/Total")]
        public async Task<ActionResult<ResumenCostosDTO>> GetTotalCitasPaciente(
            int idPaciente,
            [FromQuery] DateTime? fechaInicio = null,
            [FromQuery] DateTime? fechaFin = null)
        {
            var resumen = await _facturaService.CalcularTotalCitasPacienteAsync(idPaciente, fechaInicio, fechaFin);
            return Ok(resumen);
        }

        // GET: api/Facturas/Paciente/5/Tratamientos/Total
        [HttpGet("Paciente/{idPaciente}/Tratamientos/Total")]
        public async Task<ActionResult<ResumenCostosDTO>> GetTotalTratamientosPaciente(
            int idPaciente,
            [FromQuery] DateTime? fechaInicio = null,
            [FromQuery] DateTime? fechaFin = null)
        {
            var resumen = await _facturaService.CalcularTotalTratamientosPacienteAsync(idPaciente, fechaInicio, fechaFin);
            return Ok(resumen);
        }

        // GET: api/Facturas/Paciente/5/Resumen - Obtiene citas y tratamientos por separado
        [HttpGet("Paciente/{idPaciente}/Resumen")]
        public async Task<ActionResult> GetResumenCompletoPaciente(
            int idPaciente,
            [FromQuery] DateTime? fechaInicio = null,
            [FromQuery] DateTime? fechaFin = null)
        {
            var resumenCitas = await _facturaService.CalcularTotalCitasPacienteAsync(idPaciente, fechaInicio, fechaFin);
            var resumenTratamientos = await _facturaService.CalcularTotalTratamientosPacienteAsync(idPaciente, fechaInicio, fechaFin);

            return Ok(new
            {
                IdPaciente = idPaciente,
                Citas = resumenCitas,
                Tratamientos = resumenTratamientos,
                // No se suman, se mantienen separados
                TotalGeneral = resumenCitas.Total + resumenTratamientos.Total
            });
        }

        // POST: api/Facturas/GenerarDesdeCitas
        [HttpPost("GenerarDesdeCitas")]
        public async Task<ActionResult<Factura>> GenerarFacturaDesdeCitas([FromBody] GenerarFacturaCitasRequest request)
        {
            try
            {
                var factura = await _facturaService.GenerarFacturaDesdeCitasAsync(
                    request.IdPaciente,
                    request.IdsCitas,
                    request.IdUsuarioCreador);

                return CreatedAtAction("GetFactura", new { id = factura.IdFactura }, factura);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/Facturas/GenerarDesdeTratamiento
        [HttpPost("GenerarDesdeTratamiento")]
        public async Task<ActionResult<Factura>> GenerarFacturaDesdeTratamiento([FromBody] GenerarFacturaTratamientoRequest request)
        {
            try
            {
                var factura = await _facturaService.GenerarFacturaDesdeTratamientoAsync(
                    request.IdTratamiento,
                    request.IdUsuarioCreador);

                return CreatedAtAction("GetFactura", new { id = factura.IdFactura }, factura);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/Facturas/Paciente/5
        [HttpGet("Paciente/{idPaciente}")]
        public async Task<ActionResult<List<Factura>>> GetFacturasPaciente(int idPaciente)
        {
            var facturas = await _facturaService.ObtenerFacturasPacienteAsync(idPaciente);
            return Ok(facturas);
        }

        // PUT: api/Facturas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFactura(int id, Factura factura)
        {
            if (id != factura.IdFactura)
            {
                return BadRequest();
            }

            _context.Entry(factura).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FacturaExists(id))
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

        // POST: api/Facturas
        [HttpPost]
        public async Task<ActionResult<Factura>> PostFactura(Factura factura)
        {
            _context.Factura.Add(factura);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFactura", new { id = factura.IdFactura }, factura);
        }

        // DELETE: api/Facturas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFactura(int id)
        {
            var factura = await _context.Factura.FindAsync(id);
            if (factura == null)
            {
                return NotFound();
            }

            _context.Factura.Remove(factura);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FacturaExists(int id)
        {
            return _context.Factura.Any(e => e.IdFactura == id);
        }
    }

    public class GenerarFacturaCitasRequest
    {
        public int IdPaciente { get; set; }
        public List<int> IdsCitas { get; set; } = new List<int>();
        public int IdUsuarioCreador { get; set; }
    }

    public class GenerarFacturaTratamientoRequest
    {
        public int IdTratamiento { get; set; }
        public int IdUsuarioCreador { get; set; }
    }
}
