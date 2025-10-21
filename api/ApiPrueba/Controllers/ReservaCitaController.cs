using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ApiPrueba.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservasCitaController : ControllerBase
    {
        private readonly IReservaCitaService _service;
        public ReservasCitaController(IReservaCitaService service) => _service = service;

        [HttpGet("{idCita:int}")]
        public async Task<IActionResult> GetByCita(int idCita)
        {
            var r = await _service.GetByCitaIdAsync(idCita);
            if (r == null) return NotFound();
            return Ok(r);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ReservaCita model)
        {
            var created = await _service.CreateAsync(model);
            return CreatedAtAction(nameof(GetByCita), new { idCita = created.IdCita }, created);
        }

        [HttpGet("confirm/{token}")]
        public async Task<IActionResult> Confirm(string token)
        {
            var r = await _service.ConfirmAsync(token);
            if (r == null) return NotFound();
            return Ok(r);
        }

        [HttpPost("cancel/{id}")]
        public async Task<IActionResult> Cancel(int id)
        {
            var ok = await _service.CancelAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }
    }
}
