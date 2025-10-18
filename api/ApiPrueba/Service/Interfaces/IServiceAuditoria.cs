using ApiPrueba.DTO;

namespace ApiPrueba.Service.Interfaces
{
    public interface IServiceAuditoria
    {
        Task<IEnumerable<AuditoriaDTO>> ObtenerTodas();
        Task RegistrarAccion(AuditoriaDTO auditoria);
        Task<bool> Eliminar(int id);
        public Task ObtenerRegistros();
    }
}
