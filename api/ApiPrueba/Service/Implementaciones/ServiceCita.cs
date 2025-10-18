using ApiPrueba.data;
using ApiPrueba.DTO;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class ServicioCita : IServicioCita
    {
        private readonly ClinicaFisioterapiaBD _contexto;

        public ServicioCita(ClinicaFisioterapiaBD contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<CitaDTO>> ObtenerTodas()
        {
            return await _contexto.Citas
                .Include(c => c.Paciente)
                .Include(c => c.Terapeuta)
                .Select(c => new CitaDTO
                {
                    Id = c.Id,
                    Paciente = c.Paciente.NombreCompleto,
                    Terapeuta = c.Terapeuta.NombreCompleto,
                    Fecha = c.FechaCita,
                    Estado = c.Estado
                }).ToListAsync();
        }

        public async Task<CitaDTO> ObtenerPorId(int id)
        {
            var cita = await _contexto.Citas
                .Include(c => c.Paciente)
                .Include(c => c.Terapeuta)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cita == null) return null;

            return new CitaDTO
            {
                Id = cita.Id,
                Paciente = cita.Paciente.NombreCompleto,
                Terapeuta = cita.Terapeuta.NombreCompleto,
                Fecha = cita.FechaCita,
                Estado = cita.Estado
            };
        }

        public async Task Crear(CitaDTO citaDto)
        {
            var cita = new Cita
            {
                IdPaciente = citaDto.PacienteId,
                IdTerapeuta = citaDto.TerapeutaId,
                FechaCita = citaDto.Fecha,
                Estado = citaDto.Estado
            };

            _contexto.Citas.Add(cita);
            await _contexto.SaveChangesAsync();
        }

        public async Task<bool> Actualizar(CitaDTO citaDto)
        {
            var cita = await _contexto.Citas.FindAsync(citaDto.Id);
            if (cita == null) return false;

            cita.IdPaciente = citaDto.PacienteId;
            cita.IdTerapeuta = citaDto.TerapeutaId;
            cita.FechaCita = citaDto.Fecha;
            cita.Estado = citaDto.Estado;

            await _contexto.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            var cita = await _contexto.Citas.FindAsync(id);
            if (cita == null) return false;

            _contexto.Citas.Remove(cita);
            await _contexto.SaveChangesAsync();
            return true;
        }
    }
}
