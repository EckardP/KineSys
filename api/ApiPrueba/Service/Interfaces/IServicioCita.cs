using ApiPrueba.DTO;

namespace ApiPrueba.Service.Interfaces
{
    public interface IServicioCita
    {
        Task<IEnumerable<CitaDTO>> ObtenerTodas();
        Task<CitaDTO> ObtenerPorId(int id);
        Task Crear(CitaDTO cita);
        Task<bool> Actualizar(CitaDTO cita);
        Task<bool> Eliminar(int id);
    }
}
