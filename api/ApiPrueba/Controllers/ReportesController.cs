using ApiPrueba.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ApiPrueba.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportesController : ControllerBase
    {
        private readonly IServiceReporte _servicioReporte;

        public ReportesController(IServiceReporte servicioReporte)
        {
            _servicioReporte = servicioReporte;
        }

        [HttpGet("pacientes")]
        public async Task<ActionResult> ReportePacientes()
        {
            await _servicioReporte.GenerarReportePacientes(); // Removed assignment to a variable since the method returns void
            return Ok("Reporte de pacientes generado exitosamente.");
        }

        [HttpGet("terapeutas")]
        public async Task<ActionResult> ReporteTerapeutas()
        {
            await _servicioReporte.GenerarReporteTerapeutas(); // Removed assignment to a variable since the method returns void
            return Ok("Reporte de terapeutas generado exitosamente.");
        }

        [HttpGet("facturacion")]
        public async Task<ActionResult> ReporteFacturacion()
        {
            await _servicioReporte.GenerarReporteFacturacion(); // Fixed by removing the assignment to a variable
            return Ok("Reporte de facturación generado exitosamente."); // Adjusted response to match the void return type
        }
    }
}
