using ApiPrueba.DTO;

namespace ApiPrueba.Service.Interfaces
{
    public interface IServicioFactura
    {
        Task<IEnumerable<FacturaDTO>> ObtenerTodas();
        Task<FacturaDTO> ObtenerPorId(int id);
        Task Crear(FacturaDTO factura);
        Task<bool> Actualizar(FacturaDTO factura);
        Task<bool> Eliminar(int id);
    }
}
