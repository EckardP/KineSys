using ApiPrueba.data;
using ApiPrueba.DTO;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class ServicioPlanTratamiento : IServicioPlanTratamiento
    {
        private readonly ClinicaFisioterapiaBD _contexto;

        public ServicioPlanTratamiento(ClinicaFisioterapiaBD contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<PlanTratamientoDTO>> ObtenerTodos()
        {
            return await _contexto.PlanesTratamiento
                .Include(p => p.Paciente)
                .Include(p => p.Terapeuta)
                .Select(p => new PlanTratamientoDTO
                {
                    Id = p.Id,
                    Paciente = p.Paciente.NombreCompleto,
                    Terapeuta = p.Terapeuta.NombreCompleto,
                    Observaciones = p.Observaciones,
                    DuracionDias = p.DuracionDias
                }).ToListAsync();
        }

        public async Task<PlanTratamientoDTO> ObtenerPorId(int id)
        {
            var plan = await _contexto.PlanesTratamiento
                .Include(p => p.Paciente)
                .Include(p => p.Terapeuta)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (plan == null) return null;

            return new PlanTratamientoDTO
            {
                Id = plan.Id,
                Paciente = plan.Paciente.NombreCompleto,
                Terapeuta = plan.Terapeuta.NombreCompleto,
                Observaciones = plan.Observaciones,
                DuracionDias = plan.DuracionDias
            };
        }

        public async Task Crear(PlanTratamientoDTO planDto)
        {
            var plan = new PlanTratamiento
            {
                IdPaciente = planDto.PacienteId,
                IdTerapeuta = planDto.TerapeutaId,
                Observaciones = planDto.Observaciones,
                DetallesSesiones = planDto.DetallesSesiones
            };

            _contexto.PlanesTratamiento.Add(plan);
            await _contexto.SaveChangesAsync();
        }

        public async Task<bool> Actualizar(PlanTratamientoDTO planDto)
        {
            var plan = await _contexto.PlanesTratamiento.FindAsync(planDto.Id);
            if (plan == null) return false;

            plan.IdPaciente = planDto.PacienteId;
            plan.IdTerapeuta = planDto.TerapeutaId;
            plan.Observaciones = planDto.Observaciones;
            plan.DuracionDias = planDto.DuracionDias;

            await _contexto.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            var plan = await _contexto.PlanesTratamiento.FindAsync(id);
            if (plan == null) return false;

            _contexto.PlanesTratamiento.Remove(plan);
            await _contexto.SaveChangesAsync();
            return true;
        }

        public Task Crear(TratamientoDTO tratamiento)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Actualizar(TratamientoDTO tratamiento)
        {
            throw new NotImplementedException();
        }
    }
}
