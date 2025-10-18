using ApiPrueba.DTO;

namespace ApiPrueba.Service.Interfaces
{
    public interface IServicioPlanTratamiento
    {
        Task<IEnumerable<PlanTratamientoDTO>> ObtenerTodos();
        Task<PlanTratamientoDTO> ObtenerPorId(int id);
        Task Crear(PlanTratamientoDTO plan);
        Task<bool> Actualizar(PlanTratamientoDTO plan);
        Task<bool> Eliminar(int id);
        Task Crear(TratamientoDTO tratamiento);
        Task<bool> Actualizar(TratamientoDTO tratamiento);
    }
}
