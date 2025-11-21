using ApiPrueba.DTOs;
using ApiPrueba.Models;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Services
{
    /// <summary>
    /// Servicio para gestionar la carga y descarga de documentos
    /// </summary>
    public interface IDocumentoService
    {
        Task<DocumentoPaciente> SubirDocumento(SubirDocumentoDTO dto, Stream archivo, string nombreArchivo, string mimeType);
        Task<Stream?> DescargarDocumento(int idDocumento, int idUsuario, Rol rolUsuario);
        Task<bool> EliminarDocumento(int idDocumento, int idUsuario, Rol rolUsuario);
        Task<List<DocumentoDTO>> ObtenerDocumentosPaciente(int idPaciente, int idUsuario, Rol rolUsuario);
    }

    public class DocumentoService : IDocumentoService
    {
        private readonly DbContext _context;
        private readonly string _rutaAlmacenamiento;
        private const long TAMAÑO_MAXIMO = 10 * 1024 * 1024; // 10 MB en bytes

        public DocumentoService(DbContext context, string rutaAlmacenamiento)
        {
            _context = context;
            _rutaAlmacenamiento = rutaAlmacenamiento;
        }

        /// <summary>
        /// Sube un documento del paciente con validaciones
        /// </summary>
        public async Task<DocumentoPaciente> SubirDocumento(
            SubirDocumentoDTO dto,
            Stream archivo,
            string nombreArchivo,
            string mimeType)
        {
            // Validar tamaño del archivo
            if (archivo.Length > TAMAÑO_MAXIMO)
            {
                throw new Exception($"El archivo excede el tamaño máximo permitido de 10 MB");
            }

            // Validar tipo de archivo
            var extensionesPermitidas = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
            var extension = Path.GetExtension(nombreArchivo).ToLower();
            if (!extensionesPermitidas.Contains(extension))
            {
                throw new Exception("Formato de archivo no permitido. Solo se permiten PDF, JPG y PNG");
            }

            // Generar nombre único para el archivo
            var nombreUnico = $"{Guid.NewGuid()}{extension}";
            var carpetaPaciente = Path.Combine(_rutaAlmacenamiento, $"Paciente_{dto.IdPaciente}");

            // Crear carpeta si no existe
            Directory.CreateDirectory(carpetaPaciente);

            var rutaCompleta = Path.Combine(carpetaPaciente, nombreUnico);

            // Guardar archivo en disco
            using (var fileStream = new FileStream(rutaCompleta, FileMode.Create))
            {
                await archivo.CopyToAsync(fileStream);
            }

            // Crear registro en base de datos
            var documento = new DocumentoPaciente
            {
                IdPaciente = dto.IdPaciente,
                TipoDocumento = dto.TipoDocumento,
                NombreArchivo = nombreArchivo,
                Ruta = rutaCompleta,
                MimeType = mimeType,
                TamañoArchivo = archivo.Length,
                FechaSubida = DateTime.Now,
                IdUsuarioSubida = dto.IdUsuarioSubida,
                Descripcion = dto.Descripcion
            };

            _context.Set<DocumentoPaciente>().Add(documento);
            await _context.SaveChangesAsync();

            return documento;
        }

        /// <summary>
        /// Descarga un documento verificando permisos
        /// </summary>
        public async Task<Stream?> DescargarDocumento(int idDocumento, int idUsuario, Rol rolUsuario)
        {
            var documento = await _context.Set<DocumentoPaciente>()
                .FirstOrDefaultAsync(d => d.IdDocumento == idDocumento);

            if (documento == null)
            {
                return null;
            }

            // Verificar permisos usando el servicio de historial
            var historialService = new HistorialClinicoService(_context);
            if (!await historialService.VerificarAcceso(idUsuario, rolUsuario, documento.IdPaciente))
            {
                throw new UnauthorizedAccessException("No tiene permisos para descargar este documento");
            }

            // Verificar que el archivo existe
            if (!File.Exists(documento.Ruta))
            {
                throw new FileNotFoundException("El archivo no se encuentra en el servidor");
            }

            return File.OpenRead(documento.Ruta);
        }

        /// <summary>
        /// Elimina un documento (solo administradores o quien lo subió)
        /// </summary>
        public async Task<bool> EliminarDocumento(int idDocumento, int idUsuario, Rol rolUsuario)
        {
            var documento = await _context.Set<DocumentoPaciente>()
                .FirstOrDefaultAsync(d => d.IdDocumento == idDocumento);

            if (documento == null)
            {
                return false;
            }

            // Solo administradores o quien subió el documento pueden eliminarlo
            if (rolUsuario != Rol.Administrador && documento.IdUsuarioSubida != idUsuario)
            {
                throw new UnauthorizedAccessException("No tiene permisos para eliminar este documento");
            }

            // Eliminar archivo físico
            if (File.Exists(documento.Ruta))
            {
                File.Delete(documento.Ruta);
            }

            // Eliminar registro de base de datos
            _context.Set<DocumentoPaciente>().Remove(documento);
            await _context.SaveChangesAsync();

            return true;
        }

        /// <summary>
        /// Obtiene lista de documentos de un paciente
        /// </summary>
        public async Task<List<DocumentoDTO>> ObtenerDocumentosPaciente(
            int idPaciente,
            int idUsuario,
            Rol rolUsuario)
        {
            // Verificar permisos
            var historialService = new HistorialClinicoService(_context);
            if (!await historialService.VerificarAcceso(idUsuario, rolUsuario, idPaciente))
            {
                throw new UnauthorizedAccessException("No tiene permisos para ver estos documentos");
            }

            return await _context.Set<DocumentoPaciente>()
                .Where(d => d.IdPaciente == idPaciente)
                .OrderByDescending(d => d.FechaSubida)
                .Select(d => new DocumentoDTO
                {
                    IdDocumento = d.IdDocumento,
                    TipoDocumento = d.TipoDocumento.ToString(),
                    NombreArchivo = d.NombreArchivo,
                    Ruta = d.Ruta,
                    FechaSubida = d.FechaSubida,
                    Descripcion = d.Descripcion,
                    TamañoArchivo = d.TamañoArchivo
                })
                .ToListAsync();
        }
    }
}
