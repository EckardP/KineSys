using ApiPrueba.DTO;

namespace ApiPrueba.Service.Interfaces
{
    public interface IServicioChat
    {
        Task<IEnumerable<MensajeDTO>> ObtenerConversacion(int usuario1Id, int usuario2Id);
        Task EnviarMensaje(MensajeDTO mensaje);
        Task<bool> EliminarMensaje(int id);
        Task ObtenerMensajes(int idConversacion);
    }
}
