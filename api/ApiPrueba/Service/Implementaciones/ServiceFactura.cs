using ApiPrueba.data;
using ApiPrueba.DTO;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class ServicioFactura : IServicioFactura
    {
        private readonly ClinicaFisioterapiaBD _contexto;

        public ServicioFactura(ClinicaFisioterapiaBD contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<FacturaDTO>> ObtenerTodas()
        {
            return await _contexto.Facturas
                .Include(f => f.Paciente)
                .Select(f => new FacturaDTO
                {
                    Id = f.Id,
                    Paciente = f.Paciente.NombreCompleto,
                    MontoTotal = f.MontoTotal,
                    FechaEmision = f.FechaEmision
                }).ToListAsync();
        }

        public async Task<FacturaDTO> ObtenerPorId(int id)
        {
            var factura = await _contexto.Facturas
                .Include(f => f.Paciente)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (factura == null) return null;

            return new FacturaDTO
            {
                Id = factura.Id,
                Paciente = factura.Paciente.NombreCompleto,
                MontoTotal = factura.MontoTotal,
                FechaEmision = factura.FechaEmision
            };
        }

        public async Task Crear(FacturaDTO facturaDto)
        {
            var factura = new Factura
            {
                IdPaciente = facturaDto.PacienteId,
                MontoTotal = facturaDto.MontoTotal,
                FechaEmision = facturaDto.FechaEmision
            };

            _contexto.Facturas.Add(factura);
            await _contexto.SaveChangesAsync();
        }

        public async Task<bool> Actualizar(FacturaDTO facturaDto)
        {
            var factura = await _contexto.Facturas.FindAsync(facturaDto.Id);
            if (factura == null) return false;

            factura.IdPaciente = facturaDto.PacienteId;
            factura.MontoTotal = facturaDto.MontoTotal;
            factura.FechaEmision = facturaDto.FechaEmision;

            await _contexto.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            var factura = await _contexto.Facturas.FindAsync(id);
            if (factura == null) return false;

            _contexto.Facturas.Remove(factura);
            await _contexto.SaveChangesAsync();
            return true;
        }
    }
}
