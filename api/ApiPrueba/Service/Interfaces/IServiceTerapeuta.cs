using ApiPrueba.DTO;

namespace ApiPrueba.Service.Interfaces
{
    public interface IServicioTerapeuta
    {
        Task<IEnumerable<TerapeutaDTO>> ObtenerTodos();
        Task<TerapeutaDTO> ObtenerPorId(int id);
        Task Crear(TerapeutaDTO terapeuta);
        Task<bool> Actualizar(TerapeutaDTO terapeuta);
        Task<bool> Eliminar(int id);
    }
}
