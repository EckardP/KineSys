using ApiPrueba.DTO;

namespace ApiPrueba.Service.Interfaces
{
    public interface IServicioInventario
    {
        Task<IEnumerable<InventarioDTO>> ObtenerTodos();
        Task<InventarioDTO> ObtenerPorId(int id);
        Task Crear(InventarioDTO equipo);
        Task<bool> Actualizar(InventarioDTO equipo);
        Task<bool> Eliminar(int id);
        Task Crear(EquipoDTO equipo);
        Task<bool> Actualizar(EquipoDTO equipo);
    }
}
