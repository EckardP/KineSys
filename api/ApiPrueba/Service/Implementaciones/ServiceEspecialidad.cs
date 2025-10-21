using ApiPrueba.data;
using ApiPrueba.DTO;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class ServicioEspecialidad : IServiceEspecialidad
    {
        private readonly ClinicaFisioterapiaBD _contexto;

        public ServicioEspecialidad(ClinicaFisioterapiaBD contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<EspecialidadDTO>> ObtenerTodas()
        {
            var especialidades = await _contexto.Especialidades.ToListAsync();

            return especialidades.Select(e => new EspecialidadDTO
            {
                Id = e.Id,
                Nombre = e.Nombre,
                Descripcion = e.Descripcion
            });
        }

        public async Task<EspecialidadDTO> ObtenerPorId(int id)
        {
            var especialidad = await _contexto.Especialidades.FindAsync(id);
            if (especialidad == null)
                return null;

            return new EspecialidadDTO
            {
                Id = especialidad.Id,
                Nombre = especialidad.Nombre,
                Descripcion = especialidad.Descripcion
            };
        }

        public async Task Crear(EspecialidadDTO dto)
        {
            var especialidad = new Especialidad
            {
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion
            };

            _contexto.Especialidades.Add(especialidad);
            await _contexto.SaveChangesAsync();
        }

        public async Task<bool> Actualizar(EspecialidadDTO dto)
        {
            var especialidad = await _contexto.Especialidades.FindAsync(dto.Id);
            if (especialidad == null)
                return false;

            especialidad.Nombre = dto.Nombre;
            especialidad.Descripcion = dto.Descripcion;

            _contexto.Especialidades.Update(especialidad);
            await _contexto.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            var especialidad = await _contexto.Especialidades.FindAsync(id);
            if (especialidad == null)
                return false;

            _contexto.Especialidades.Remove(especialidad);
            await _contexto.SaveChangesAsync();
            return true;
        }
    }
}
