namespace ApiPrueba.Service.Interfaces
{
    public interface IServiceReporte
    {
        // Reporte general de pacientes (por cantidad, edad, género, etc.)
        Task<IEnumerable<object>> ObtenerResumenPacientes();

        // Reporte de citas (por terapeuta, por fecha, por estado)
        Task<IEnumerable<object>> ObtenerResumenCitas();

        // Reporte de tratamientos activos o finalizados
        Task<IEnumerable<object>> ObtenerResumenTratamientos();

        // Reporte financiero general (facturas y pagos)
        Task<IEnumerable<object>> ObtenerResumenFinanciero();

        // Reporte de inventario (equipos, cantidades, estados)
        Task<IEnumerable<object>> ObtenerResumenInventario();

        // Reporte personalizado por rango de fechas
        Task<IEnumerable<object>> ObtenerReportePersonalizado(string tipo, string fechaInicio, string fechaFin);
        Task GenerarReportePacientes();
        Task GenerarReporteTerapeutas();
        Task GenerarReporteFacturacion();
    }
}
