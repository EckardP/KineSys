using ApiPrueba.DTOs;
using ApiPrueba.Models;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Services
{
    /// <summary>
    /// Servicio para gestionar el historial clínico completo del paciente
    /// </summary>
    public interface IHistorialClinicoService
    {
        Task<HistorialClinicoCompletoDTO?> ObtenerHistorialCompleto(int idPaciente, int idUsuario, Rol rolUsuario);
        Task<bool> VerificarAcceso(int idUsuario, Rol rolUsuario, int idPaciente);
        Task<byte[]> ExportarHistorialPDF(ExportarHistorialDTO request, int idUsuario, Rol rolUsuario);
    }

    public class HistorialClinicoService : IHistorialClinicoService
    {
        private readonly DbContext _context; // Reemplazar con tu DbContext específico

        public HistorialClinicoService(DbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Verifica si el usuario tiene permiso para acceder al historial del paciente
        /// </summary>
        public async Task<bool> VerificarAcceso(int idUsuario, Rol rolUsuario, int idPaciente)
        {
            switch (rolUsuario)
            {
                case Rol.Administrador:
                    // Administradores tienen acceso completo
                    return true;

                case Rol.Paciente:
                    // Pacientes solo pueden ver su propio historial
                    return idUsuario == idPaciente;

                case Rol.Terapeuta:
                    // Terapeutas solo pueden ver historial de sus pacientes asignados
                    var tieneAsignacion = await _context.Set<Tratamiento>()
                        .AnyAsync(t => t.IdPaciente == idPaciente && t.IdTerapeuta == idUsuario);
                    return tieneAsignacion;

                default:
                    return false;
            }
        }

        /// <summary>
        /// Obtiene el historial clínico completo del paciente con control de acceso
        /// </summary>
        public async Task<HistorialClinicoCompletoDTO?> ObtenerHistorialCompleto(
            int idPaciente,
            int idUsuario,
            Rol rolUsuario)
        {
            // Verificar permisos de acceso
            if (!await VerificarAcceso(idUsuario, rolUsuario, idPaciente))
            {
                throw new UnauthorizedAccessException("No tiene permisos para acceder a este historial");
            }

            // Obtener datos del paciente
            var paciente = await _context.Set<Paciente>()
                .Include(p => p.SeguroMedico)
                .Include(p => p.HistorialMedico)
                .FirstOrDefaultAsync(p => p.Id == idPaciente);

            if (paciente == null)
            {
                return null;
            }

            // Construir DTO completo
            var historialCompleto = new HistorialClinicoCompletoDTO
            {
                DatosPaciente = new DatosPacienteDTO
                {
                    Id = paciente.Id,
                    NombreCompleto = $"{paciente.Nombres} {paciente.Apellidos}",
                    DocumentoIdentidad = paciente.DocumentoIdentidad,
                    FechaNacimiento = paciente.FechaNacimiento,
                    Genero = paciente.Genero,
                    Telefono = paciente.Telefono,
                    CorreoElectronico = paciente.CorreoElectronico,
                    Direccion = paciente.Direccion,
                    SeguroMedico = paciente.SeguroMedico?.NombreAseguradora
                },

                HistorialMedico = paciente.HistorialMedico != null ? new HistorialMedicoDTO
                {
                    Alergias = paciente.HistorialMedico.Alergias,
                    EnfermedadesCronicas = paciente.HistorialMedico.EnfermedadesCronicas,
                    CirugiasAnteriores = paciente.HistorialMedico.CirugiasAnteriores,
                    MedicamentosActuales = paciente.HistorialMedico.MedicamentosActuales,
                    AntecedentesHeredofamiliares = paciente.HistorialMedico.AntecedentesHeredofamiliares,
                    Habitos = paciente.HistorialMedico.Habitos,
                    ObservacionesGenerales = paciente.HistorialMedico.ObservacionesGenerales
                } : null,

                Diagnosticos = await _context.Set<Diagnostico>()
                    .Where(d => d.IdPaciente == idPaciente)
                    .Include(d => d.Terapeuta)
                    .OrderByDescending(d => d.FechaDiagnostico)
                    .Select(d => new DiagnosticoDTO
                    {
                        IdDiagnostico = d.IdDiagnostico,
                        Fecha = d.FechaDiagnostico,
                        DescripcionDiagnostico = d.Descripcion,
                        TerapeutaResponsable = d.Terapeuta != null ? $"{d.Terapeuta.Nombres} {d.Terapeuta.Apellidos}" : null
                    })
                    .ToListAsync(),

                Tratamientos = await _context.Set<Tratamiento>()
                    .Where(t => t.IdPaciente == idPaciente)
                    .Include(t => t.Terapeuta)
                    .Include(t => t.TratamientoTipoTerapias)
                        .ThenInclude(ttt => ttt.TipoTerapia)
                    .Select(t => new TratamientoDTO
                    {
                        IdTratamiento = t.Id,
                        Nombre = t.Nombre,
                        Descripcion = t.Descripcion,
                        DuracionMinutos = t.DuracionMinutos,
                        SesionesRecomendadas = t.SesionesRecomendadas,
                        FrecuenciaRecomendada = t.FrecuenciaRecomendada,
                        CostoBase = t.CostoBase,
                        TipoTerapia = string.Join(", ", t.TratamientoTipoTerapias.Select(ttt => ttt.TipoTerapia!.Nombre)),
                        TerapeutaAsignado = t.Terapeuta != null ? $"{t.Terapeuta.Nombres} {t.Terapeuta.Apellidos}" : null,
                        Activo = t.Activo
                    })
                    .ToListAsync(),

                Sesiones = await _context.Set<NotaSesion>()
                    .Where(ns => ns.IdPaciente == idPaciente)
                    .Include(ns => ns.Cita)
                        .ThenInclude(c => c!.Terapeuta)
                    .OrderByDescending(ns => ns.Fecha)
                    .Select(ns => new SesionDTO
                    {
                        IdNota = ns.IdNota,
                        FechaSesion = ns.Fecha,
                        TerapeutaNombre = ns.Cita != null && ns.Cita.Terapeuta != null
                            ? $"{ns.Cita.Terapeuta.Nombres} {ns.Cita.Terapeuta.Apellidos}"
                            : ns.RegistradoPor,
                        NotaEvolucion = ns.Notas,
                        ObjetivosLogrados = ns.Recomendaciones
                    })
                    .ToListAsync(),

                Evoluciones = await _context.Set<EvolucionPaciente>()
                    .Where(e => e.IdPaciente == idPaciente)
                    .OrderByDescending(e => e.Fecha)
                    .Select(e => new EvolucionDTO
                    {
                        IdEvolucion = e.IdEvolucion,
                        Fecha = e.Fecha,
                        Indicador = e.Indicador,
                        Valor = e.Valor
                    })
                    .ToListAsync(),

                Documentos = await ObtenerDocumentosConUsuario(idPaciente)
            };

            return historialCompleto;
        }

        private async Task<List<DocumentoDTO>> ObtenerDocumentosConUsuario(int idPaciente)
        {
            var documentos = await _context.Set<DocumentoPaciente>()
                .Where(d => d.IdPaciente == idPaciente)
                .OrderByDescending(d => d.FechaSubida)
                .ToListAsync();

            var documentosDTO = new List<DocumentoDTO>();

            foreach (var doc in documentos)
            {
                string? nombreUsuario = null;

                if (doc.IdUsuarioSubida.HasValue)
                {
                    var terapeuta = await _context.Set<Terapeuta>()
                        .Where(t => t.Id == doc.IdUsuarioSubida.Value)
                        .FirstOrDefaultAsync();

                    if (terapeuta != null)
                    {
                        nombreUsuario = $"{terapeuta.Nombres} {terapeuta.Apellidos}";
                    }
                    else
                    {
                        var administrador = await _context.Set<Administrador>()
                            .Where(a => a.Id == doc.IdUsuarioSubida.Value)
                            .FirstOrDefaultAsync();

                        if (administrador != null)
                        {
                            nombreUsuario = $"{administrador.Nombres} {administrador.Apellidos}";
                        }
                    }
                }

                documentosDTO.Add(new DocumentoDTO
                {
                    IdDocumento = doc.IdDocumento,
                    TipoDocumento = doc.TipoDocumento.ToString(),
                    NombreArchivo = doc.NombreArchivo,
                    Ruta = doc.Ruta,
                    FechaSubida = doc.FechaSubida,
                    SubidoPor = nombreUsuario ?? "Sistema",
                    Descripcion = doc.Descripcion,
                    TamañoArchivo = doc.TamañoArchivo
                });
            }

            return documentosDTO;
        }

        /// <summary>
        /// Exporta el historial clínico a PDF con formato profesional
        /// </summary>
        public async Task<byte[]> ExportarHistorialPDF(ExportarHistorialDTO request, int idUsuario, Rol rolUsuario)
        {
            var historial = await ObtenerHistorialCompleto(
                request.IdPaciente,
                idUsuario,
                rolUsuario
            );

            if (historial == null)
            {
                throw new Exception("No se encontró el historial del paciente");
            }

            // TODO: Implementar generación de PDF con iTextSharp o QuestPDF
            // Incluir:
            // - Encabezado con logo de la clínica (request.LogoClinica)
            // - Nombre de la clínica (request.NombreClinica)
            // - Datos del paciente
            // - Historial médico completo
            // - Filtrar por fechas si request.FechaDesde y request.FechaHasta están definidos

            return Array.Empty<byte>();
        }
    }
}