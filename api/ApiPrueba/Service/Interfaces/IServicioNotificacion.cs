using ApiPrueba.DTO;

namespace ApiPrueba.Service.Interfaces
{
    public interface IServicioNotificacion
    {
        Task<IEnumerable<NotificacionDTO>> ObtenerTodas();
        Task<NotificacionDTO> ObtenerPorId(int id);
        Task Crear(NotificacionDTO notificacion);
        Task<bool> MarcarComoLeida(int id);
        Task<bool> Eliminar(int id);
        Task Enviar(NotificacionDTO notificacion);
        Task GenerarReportePacientes();
    }
}
