using ApiPrueba.DTO;

namespace ApiPrueba.Service.Interfaces
{
    public interface IServiceTratamiento
    {
        Task<IEnumerable<TratamientoDTO>> ObtenerTodos();
        Task<TratamientoDTO> ObtenerPorId(int id);
        Task Crear(TratamientoDTO tratamiento);
        Task<bool> Actualizar(TratamientoDTO tratamiento);
        Task<bool> Eliminar(int id);
    }
}
