using ApiPrueba.data;
using ApiPrueba.DTO;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class ServicioTerapeuta : IServicioTerapeuta
    {
        private readonly ClinicaFisioterapiaBD _contexto;

        public ServicioTerapeuta(ClinicaFisioterapiaBD contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<TerapeutaDTO>> ObtenerTodos()
        {
            return await _contexto.Terapeutas
                .Select(t => new TerapeutaDTO
                {
                    Id = t.Id,
                    NombreCompleto = t.NombreCompleto,
                    //Especialidad = t.Especialidad,
                    Telefono = t.Telefono,
                    CorreoElectronico = t.CorreoElectronico
                })
                .ToListAsync();
        }

        public async Task<TerapeutaDTO> ObtenerPorId(int id)
        {
            var t = await _contexto.Terapeutas.FindAsync(id);
            if (t == null) return null;

            return new TerapeutaDTO
            {
                Id = t.Id,
                NombreCompleto = t.NombreCompleto,
                //Especialidad = t.Especialidad,
                Telefono = t.Telefono,
                CorreoElectronico = t.CorreoElectronico
            };
        }

        public async Task Crear(TerapeutaDTO dto)
        {
            var terapeuta = new Terapeuta
            {
                NombreCompleto = dto.NombreCompleto,
                //Especialidad = dto.Especialidad,
                DocumentoIdentidad = dto.DocumentoIdentidad,
                //IdEspecialidad = dto.EspecialidadId,
                Telefono = dto.Telefono,
                CorreoElectronico = dto.CorreoElectronico
            };

            _contexto.Terapeutas.Add(terapeuta);
            await _contexto.SaveChangesAsync();
        }

        public async Task<bool> Actualizar(TerapeutaDTO dto)
        {
            var terapeuta = await _contexto.Terapeutas.FindAsync(dto.Id);
            if (terapeuta == null) return false;

            terapeuta.NombreCompleto = dto.NombreCompleto;
            //terapeuta.Especialidad = dto.Especialidad;
            terapeuta.Telefono = dto.Telefono;
            terapeuta.CorreoElectronico = dto.CorreoElectronico;

            await _contexto.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            var terapeuta = await _contexto.Terapeutas.FindAsync(id);
            if (terapeuta == null) return false;

            _contexto.Terapeutas.Remove(terapeuta);
            await _contexto.SaveChangesAsync();
            return true;
        }
    }
}
