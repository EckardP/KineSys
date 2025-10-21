using ApiPrueba.data;
using ApiPrueba.DTO;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class ServicioTratamiento : IServiceTratamiento
    {
        private readonly ClinicaFisioterapiaBD _contexto;

        public ServicioTratamiento(ClinicaFisioterapiaBD contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<TratamientoDTO>> ObtenerTodos()
        {
            var tratamientos = await _contexto.Tratamientos
                .Include(t => t.Paciente)
                .Include(t => t.Terapeuta)
                .ToListAsync();

            return tratamientos.Select(t => new TratamientoDTO
            {
                Id = t.Id,
                NombreTratamiento = t.NombreTratamiento,
                Descripcion = t.Descripcion,
                DuracionDias = t.DuracionDias,
                FechaInicio = t.FechaInicio,
                FechaFin = t.FechaFin,
                PacienteId = t.IdPaciente,
                Paciente = t.Paciente != null ? t.Paciente.NombreCompleto : "No asignado",
                TerapeutaId = t.IdTerapeuta,
                Terapeuta = t.Terapeuta != null ? t.Terapeuta.NombreCompleto : "No asignado",
                PlanTratamientoId = t.PlanTratamiento != null ? t.PlanTratamiento.Id : null
            });
        }

        public async Task<TratamientoDTO> ObtenerPorId(int id)
        {
            var t = await _contexto.Tratamientos
                .Include(x => x.Paciente)
                .Include(x => x.Terapeuta)
                .Include(x => x.PlanTratamiento)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (t == null)
                return null;

            return new TratamientoDTO
            {
                Id = t.Id,
                NombreTratamiento = t.NombreTratamiento,
                Descripcion = t.Descripcion,
                DuracionDias = t.DuracionDias,
                FechaInicio = t.FechaInicio,
                FechaFin = t.FechaFin,
                PacienteId = t.IdPaciente,
                Paciente = t.Paciente != null ? t.Paciente.NombreCompleto : "No asignado",
                TerapeutaId = t.IdTerapeuta,
                Terapeuta = t.Terapeuta != null ? t.Terapeuta.NombreCompleto : "No asignado",
                PlanTratamientoId = t.PlanTratamiento != null ? t.PlanTratamiento.Id : null
            };
        }

        public async Task Crear(TratamientoDTO dto)
        {
            var tratamiento = new Tratamiento
            {
                NombreTratamiento = dto.NombreTratamiento,
                Descripcion = dto.Descripcion,
                DuracionDias = dto.DuracionDias,
                FechaInicio = dto.FechaInicio,
                FechaFin = dto.FechaFin,
                IdPaciente = dto.PacienteId,
                IdTerapeuta = dto.TerapeutaId
            };

            _contexto.Tratamientos.Add(tratamiento);
            await _contexto.SaveChangesAsync();
        }

        public async Task<bool> Actualizar(TratamientoDTO dto)
        {
            var tratamiento = await _contexto.Tratamientos.FindAsync(dto.Id);
            if (tratamiento == null)
                return false;

            tratamiento.NombreTratamiento = dto.NombreTratamiento;
            tratamiento.Descripcion = dto.Descripcion;
            tratamiento.DuracionDias = dto.DuracionDias;
            tratamiento.FechaInicio = dto.FechaInicio;
            tratamiento.FechaFin = dto.FechaFin;
            tratamiento.IdPaciente = dto.PacienteId;
            tratamiento.IdTerapeuta = dto.TerapeutaId;

            _contexto.Tratamientos.Update(tratamiento);
            await _contexto.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            var tratamiento = await _contexto.Tratamientos.FindAsync(id);
            if (tratamiento == null)
                return false;

            _contexto.Tratamientos.Remove(tratamiento);
            await _contexto.SaveChangesAsync();
            return true;
        }
    }
}
