using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiPrueba.Data;
using ApiPrueba.Models;

namespace ApiPrueba.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentoPacientesController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;

        public DocumentoPacientesController(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        // GET: api/DocumentoPacientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DocumentoPaciente>>> GetDocumentosPaciente()
        {
            return await _context.DocumentosPaciente.ToListAsync();
        }

        // GET: api/DocumentoPacientes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DocumentoPaciente>> GetDocumentoPaciente(int id)
        {
            var documentoPaciente = await _context.DocumentosPaciente.FindAsync(id);

            if (documentoPaciente == null)
            {
                return NotFound();
            }

            return documentoPaciente;
        }

        // PUT: api/DocumentoPacientes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDocumentoPaciente(int id, DocumentoPaciente documentoPaciente)
        {
            if (id != documentoPaciente.IdDocumento)
            {
                return BadRequest();
            }

            _context.Entry(documentoPaciente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DocumentoPacienteExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/DocumentoPacientes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DocumentoPaciente>> PostDocumentoPaciente(DocumentoPaciente documentoPaciente)
        {
            _context.DocumentosPaciente.Add(documentoPaciente);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDocumentoPaciente", new { id = documentoPaciente.IdDocumento }, documentoPaciente);
        }

        // DELETE: api/DocumentoPacientes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocumentoPaciente(int id)
        {
            var documentoPaciente = await _context.DocumentosPaciente.FindAsync(id);
            if (documentoPaciente == null)
            {
                return NotFound();
            }

            _context.DocumentosPaciente.Remove(documentoPaciente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DocumentoPacienteExists(int id)
        {
            return _context.DocumentosPaciente.Any(e => e.IdDocumento == id);
        }
    }
}
