using ApiPrueba.DTO;

namespace ApiPrueba.Service.Interfaces
{
    public interface IServiceEspecialidad
    {
        Task<IEnumerable<EspecialidadDTO>> ObtenerTodas();
        Task<EspecialidadDTO> ObtenerPorId(int id);
        Task Crear(EspecialidadDTO especialidad);
        Task<bool> Actualizar(EspecialidadDTO especialidad);
        Task<bool> Eliminar(int id);
    }
}
