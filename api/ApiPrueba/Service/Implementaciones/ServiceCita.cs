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
            var lista = await _contexto.Citas
                .Include(c => c.Paciente)
                .Include(c => c.Terapeuta)
                .Include(c => c.Tratamiento)
                .ToListAsync();

            return lista.Select(MapearADTO);
        }

        public async Task<CitaDTO> ObtenerPorId(int id)
        {
            var cita = await _contexto.Citas
                .Include(c => c.Paciente)
                .Include(c => c.Terapeuta)
                .Include(c => c.Tratamiento)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cita == null) return null;
            return MapearADTO(cita);
        }

        public async Task Crear(CitaDTO dto)
        {
            var cita = new Cita
            {
                DuracionProgramadaMin = dto.DuracionProgramadaMin,
                HoraInicioReal = dto.HoraInicioReal,
                HoraFinReal = dto.HoraFinReal,
                CheckIn = dto.CheckIn,
                CheckOut = dto.CheckOut,
                Confirmada = dto.Confirmada,
                IdPaciente = dto.IdPaciente,
                IdTerapeuta = dto.IdTerapeuta,
                IdTratamiento = dto.IdTratamiento
            };

            _contexto.Citas.Add(cita);
            await _contexto.SaveChangesAsync();
        }

        public async Task<bool> Actualizar(CitaDTO dto)
        {
            var cita = await _contexto.Citas.FindAsync(dto.Id);
            if (cita == null)
                return false;

            cita.DuracionProgramadaMin = dto.DuracionProgramadaMin;
            cita.HoraInicioReal = dto.HoraInicioReal;
            cita.HoraFinReal = dto.HoraFinReal;
            cita.CheckIn = dto.CheckIn;
            cita.CheckOut = dto.CheckOut;
            cita.Confirmada = dto.Confirmada;
            cita.IdPaciente = dto.IdPaciente;
            cita.IdTerapeuta = dto.IdTerapeuta;
            cita.IdTratamiento = dto.IdTratamiento;

            _contexto.Citas.Update(cita);
            await _contexto.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            var cita = await _contexto.Citas.FindAsync(id);
            if (cita == null)
                return false;

            _contexto.Citas.Remove(cita);
            await _contexto.SaveChangesAsync();
            return true;
        }

        private CitaDTO MapearADTO(Cita cita)
        {
            return new CitaDTO
            {
                Id = cita.Id,
                DuracionProgramadaMin = cita.DuracionProgramadaMin,
                HoraInicioReal = cita.HoraInicioReal,
                HoraFinReal = cita.HoraFinReal,
                CheckIn = cita.CheckIn,
                CheckOut = cita.CheckOut,
                Confirmada = cita.Confirmada,
                IdPaciente = cita.IdPaciente,
                IdTerapeuta = cita.IdTerapeuta,
                IdTratamiento = cita.IdTratamiento,
                NombrePaciente = cita.Paciente != null ? cita.Paciente.NombreCompleto : null,
                NombreTerapeuta = cita.Terapeuta != null ? cita.Terapeuta.NombreCompleto : null,
                NombreTratamiento = cita.Tratamiento != null ? cita.Tratamiento.NombreTratamiento : null
            };
        }
    }
}
