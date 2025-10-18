using ApiPrueba.data;
using ApiPrueba.DTO;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class ServicioInventario : IServicioInventario
    {
        private readonly ClinicaFisioterapiaBD _contexto;

        public ServicioInventario(ClinicaFisioterapiaBD contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<InventarioDTO>> ObtenerTodos()
        {
            return await _contexto.Equipos
                .Select(e => new InventarioDTO
                {
                    Id = e.Id,
                    EquipoNombre = e.NombreEquipo,
                    //Estado = e.Estado,
                    Cantidad = e.Cantidad,
                    Ubicacion = e.Ubicacion
                }).ToListAsync();
        }

        public async Task<InventarioDTO> ObtenerPorId(int id)
        {
            var equipo = await _contexto.Equipos.FindAsync(id);
            if (equipo == null) return null;

            return new InventarioDTO
            {
                Id = equipo.Id,
                EquipoNombre = equipo.NombreEquipo,
                //Estado = equipo.Estado,
                Cantidad = equipo.Cantidad,
                Ubicacion = equipo.Ubicacion
            };
        }

        public async Task Crear(InventarioDTO equipoDto)
        {
            var equipo = new Equipo
            {
                NombreEquipo = equipoDto.EquipoNombre,
                Estado = equipoDto.Estado,
                Cantidad = equipoDto.Cantidad,
                Descripcion = equipoDto.Ubicacion
            };

            _contexto.Equipos.Add(equipo);
            await _contexto.SaveChangesAsync();
        }

        public async Task<bool> Actualizar(InventarioDTO equipoDto)
        {
            var equipo = await _contexto.Equipos.FindAsync(equipoDto.Id);
            if (equipo == null) return false;

            equipo.NombreEquipo = equipoDto.EquipoNombre;
            equipo.Estado = equipoDto.Estado;
            equipo.Cantidad = equipoDto.Cantidad;
            equipo.Ubicacion = equipoDto.Ubicacion;

            await _contexto.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            var equipo = await _contexto.Equipos.FindAsync(id);
            if (equipo == null) return false;

            _contexto.Equipos.Remove(equipo);
            await _contexto.SaveChangesAsync();
            return true;
        }

        public Task Crear(EquipoDTO equipo)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Actualizar(EquipoDTO equipo)
        {
            throw new NotImplementedException();
        }
    }
}
