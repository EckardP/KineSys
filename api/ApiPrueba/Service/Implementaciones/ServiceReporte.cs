using ApiPrueba.data;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class ServiceReporte : IServiceReporte
    {
        private readonly ClinicaFisioterapiaBD _contexto;

        public ServiceReporte(ClinicaFisioterapiaBD contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<object>> ObtenerResumenPacientes()
        {
            var resumen = await _contexto.Pacientes
                .GroupBy(p => p.Genero)
                .Select(g => new
                {
                    Genero = g.Key,
                    Total = g.Count()
                })
                .ToListAsync();

            return resumen;
        }

        public async Task<IEnumerable<object>> ObtenerResumenCitas()
        {
            var resumen = await _contexto.Citas
                .GroupBy(c => new { c.Estado, Mes = c.FechaCita.Month })
                .Select(g => new
                {
                    g.Key.Estado,
                    g.Key.Mes,
                    Total = g.Count()
                })
                .ToListAsync();

            return resumen;
        }

        public async Task<IEnumerable<object>> ObtenerResumenTratamientos()
        {
            var resumen = await _contexto.Tratamientos
                .GroupBy(t => t.PlanTratamiento)
                .Select(g => new
                {
                    PlanId = g.Key,
                    TotalTratamientos = g.Count(),
                    PromedioDuracion = g.Average(t => t.DuracionDias)
                })
                .ToListAsync();

            return resumen;
        }

        public async Task<IEnumerable<object>> ObtenerResumenFinanciero()
        {
            var resumen = await _contexto.Facturas
                .GroupBy(f => f.EstadoPago)
                .Select(g => new
                {
                    Estado = g.Key,
                    TotalFacturas = g.Count(),
                    SumaMontos = g.Sum(f => f.MontoTotal)
                })
                .ToListAsync();

            return resumen;
        }

        public async Task<IEnumerable<object>> ObtenerResumenInventario()
        {
            var resumen = await _contexto.Equipos
                .GroupBy(e => e.Estado)
                .Select(g => new
                {
                    Estado = g.Key,
                    TotalEquipos = g.Count(),
                    CantidadTotal = g.Sum(e => e.Cantidad)
                })
                .ToListAsync();

            return resumen;
        }

        public async Task<IEnumerable<object>> ObtenerReportePersonalizado(string tipo, string fechaInicio, string fechaFin)
        {
            DateTime inicio = DateTime.Parse(fechaInicio);
            DateTime fin = DateTime.Parse(fechaFin);

            switch (tipo.ToLower())
            {
                case "citas":
                    return await _contexto.Citas
                        .Where(c => c.FechaCita >= inicio && c.FechaCita <= fin)
                        .Select(c => new
                        {
                            c.Id,
                            c.IdPaciente,
                            c.IdTerapeuta,
                            c.FechaCita,
                            c.Estado
                        })
                        .ToListAsync();

                case "facturas":
                    return await _contexto.Facturas
                        .Where(f => f.FechaEmision >= inicio && f.FechaEmision <= fin)
                        .Select(f => new
                        {
                            f.Id,
                            f.IdPaciente,
                            f.MontoTotal,
                            f.EstadoPago
                        })
                        .ToListAsync();

                default:
                    return new List<object> { new { Mensaje = "Tipo de reporte no válido" } };
            }
        }

        public Task GenerarReportePacientes()
        {
            throw new NotImplementedException();
        }

        public Task GenerarReporteTerapeutas()
        {
            throw new NotImplementedException();
        }

        public Task GenerarReporteFacturacion()
        {
            throw new NotImplementedException();
        }
    }

}
