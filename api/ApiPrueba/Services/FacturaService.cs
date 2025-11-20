using ApiPrueba.DTOs;
using ApiPrueba.Models;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Services
{
    /// <summary>
    /// Servicio para gestionar facturación de citas y tratamientos
    /// </summary>
    public class FacturaService
    {
        private readonly DbContext _context;

        public FacturaService(DbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Calcula el costo de una cita individual
        /// </summary>
        public async Task<decimal> CalcularCostoCitaAsync(int idCita)
        {
            var cita = await _context.Set<Cita>()
                .FirstOrDefaultAsync(c => c.IdCita == idCita);

            if (cita == null)
                throw new InvalidOperationException($"No se encontró la cita con ID {idCita}");

            return cita.PrecioCita ?? 0;
        }

        /// <summary>
        /// Calcula el costo de un tratamiento individual
        /// </summary>
        public async Task<decimal> CalcularCostoTratamientoAsync(int idTratamiento)
        {
            var tratamiento = await _context.Set<Tratamiento>()
                .FirstOrDefaultAsync(t => t.Id == idTratamiento);

            if (tratamiento == null)
                throw new InvalidOperationException($"No se encontró el tratamiento con ID {idTratamiento}");

            return tratamiento.PrecioTratamiento ?? 0;
        }

        /// <summary>
        /// Calcula el total de todas las citas de un paciente (sin incluir tratamientos)
        /// </summary>
        public async Task<ResumenCostosDTO> CalcularTotalCitasPacienteAsync(
            int idPaciente,
            DateTime? fechaInicio = null,
            DateTime? fechaFin = null)
        {
            var query = _context.Set<Cita>()
                .Where(c => c.IdPaciente == idPaciente);

            if (fechaInicio.HasValue)
                query = query.Where(c => c.HoraInicioReal >= fechaInicio.Value);

            if (fechaFin.HasValue)
                query = query.Where(c => c.HoraInicioReal <= fechaFin.Value);

            var citas = await query.ToListAsync();

            var resumen = new ResumenCostosDTO
            {
                Cantidad = citas.Count,
                Total = citas.Sum(c => c.PrecioCita ?? 0),
                Items = citas.Select(c => new ItemCostoDTO
                {
                    Id = c.IdCita,
                    Descripcion = c.Motivo ?? "Cita de fisioterapia",
                    Fecha = c.HoraInicioReal ?? DateTime.Now, // Usar HoraInicioReal
                    Precio = c.PrecioCita ?? 0
                }).ToList()
            };

            return resumen;
        }

        /// <summary>
        /// Calcula el total de todos los tratamientos de un paciente (sin incluir citas)
        /// </summary>
        public async Task<ResumenCostosDTO> CalcularTotalTratamientosPacienteAsync(
            int idPaciente,
            DateTime? fechaInicio = null,
            DateTime? fechaFin = null)
        {
            var query = _context.Set<Tratamiento>()
                .Where(t => t.IdPaciente == idPaciente);

            if (fechaInicio.HasValue)
                query = query.Where(t => t.FechaInicio >= fechaInicio.Value);

            if (fechaFin.HasValue)
                query = query.Where(t => t.FechaInicio <= fechaFin.Value);

            var tratamientos = await query.ToListAsync();

            var resumen = new ResumenCostosDTO
            {
                Cantidad = tratamientos.Count,
                Total = tratamientos.Sum(t => t.PrecioTratamiento ?? 0),
                Items = tratamientos.Select(t => new ItemCostoDTO
                {
                    Id = t.Id,
                    Descripcion = t.NombreTratamiento,
                    Fecha = t.FechaInicio,
                    Precio = t.PrecioTratamiento ?? 0
                }).ToList()
            };

            return resumen;
        }

        /// <summary>
        /// Genera una factura desde una lista de citas
        /// </summary>
        public async Task<Factura> GenerarFacturaDesdeCitasAsync(
            int idPaciente,
            List<int> idsCitas,
            int idUsuarioCreador)
        {
            var citas = await _context.Set<Cita>()
                .Where(c => idsCitas.Contains(c.IdCita) && c.IdPaciente == idPaciente)
                .ToListAsync();

            if (!citas.Any())
                throw new InvalidOperationException("No se encontraron citas válidas para facturar");

            var subtotal = citas.Sum(c => c.PrecioCita ?? 0);
            var numeroFactura = await GenerarNumeroFacturaAsync();

            var factura = new Factura
            {
                NumeroFactura = numeroFactura,
                IdPaciente = idPaciente,
                FechaEmision = DateTime.Now,
                Subtotal = subtotal,
                Total = subtotal,
                Estado = "Pendiente",
                IdUsuarioCreador = idUsuarioCreador,
                FechaCreacion = DateTime.Now,
                Detalles = citas.Select(c => new DetalleFactura
                {
                    Concepto = "Cita de fisioterapia",
                    Descripcion = $"{c.Motivo} - Fecha: {c.HoraInicioReal?.ToString("dd/MM/yyyy") ?? "Sin fecha"}",
                    Cantidad = 1,
                    PrecioUnitario = c.PrecioCita ?? 0,
                    Subtotal = c.PrecioCita ?? 0
                }).ToList()
            };

            _context.Set<Factura>().Add(factura);
            await _context.SaveChangesAsync();

            return factura;
        }

        /// <summary>
        /// Genera una factura desde un tratamiento
        /// </summary>
        public async Task<Factura> GenerarFacturaDesdeTratamientoAsync(
            int idTratamiento,
            int idUsuarioCreador)
        {
            var tratamiento = await _context.Set<Tratamiento>()
                .FirstOrDefaultAsync(t => t.Id == idTratamiento);

            if (tratamiento == null)
                throw new InvalidOperationException($"No se encontró el tratamiento con ID {idTratamiento}");

            var numeroFactura = await GenerarNumeroFacturaAsync();
            var precio = tratamiento.PrecioTratamiento ?? 0;

            var factura = new Factura
            {
                NumeroFactura = numeroFactura,
                IdPaciente = tratamiento.IdPaciente,
                IdTratamiento = idTratamiento,
                FechaEmision = DateTime.Now,
                Subtotal = precio,
                Total = precio,
                Estado = "Pendiente",
                IdUsuarioCreador = idUsuarioCreador,
                FechaCreacion = DateTime.Now,
                Detalles = new List<DetalleFactura>
                {
                    new DetalleFactura
                    {
                        Concepto = "Tratamiento de fisioterapia",
                        Descripcion = $"{tratamiento.NombreTratamiento} - {tratamiento.Descripcion}",
                        Cantidad = 1,
                        PrecioUnitario = precio,
                        Subtotal = precio
                    }
                }
            };

            _context.Set<Factura>().Add(factura);
            await _context.SaveChangesAsync();

            return factura;
        }

        /// <summary>
        /// Obtiene todas las facturas de un paciente
        /// </summary>
        public async Task<List<Factura>> ObtenerFacturasPacienteAsync(int idPaciente)
        {
            return await _context.Set<Factura>()
                .Include(f => f.Detalles)
                .Where(f => f.IdPaciente == idPaciente)
                .OrderByDescending(f => f.FechaEmision)
                .ToListAsync();
        }

        /// <summary>
        /// Obtiene una factura con todos sus detalles
        /// </summary>
        public async Task<Factura?> ObtenerFacturaDetalladaAsync(int idFactura)
        {
            return await _context.Set<Factura>()
                .Include(f => f.Detalles)
                .Include(f => f.Paciente)
                .Include(f => f.Tratamiento)
                .FirstOrDefaultAsync(f => f.IdFactura == idFactura);
        }

        /// <summary>
        /// Genera un número de factura único
        /// </summary>
        private async Task<string> GenerarNumeroFacturaAsync()
        {
            var ultimaFactura = await _context.Set<Factura>()
                .OrderByDescending(f => f.IdFactura)
                .FirstOrDefaultAsync();

            var numeroSecuencial = (ultimaFactura?.IdFactura ?? 0) + 1;
            return $"FACT-{DateTime.Now:yyyyMMdd}-{numeroSecuencial:D6}";
        }
    }
}
