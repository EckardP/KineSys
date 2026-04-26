using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiPrueba.Data;
using ApiPrueba.Models;
using static ApiPrueba.Models.Persona;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using ApiPrueba.JWT;
using NuGet.Protocol;
using NuGet.Common;
using ApiPrueba.Hub;
using Microsoft.AspNetCore.SignalR;

namespace ApiPrueba.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonasController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;
        private readonly JwtTokenGenerator _JwTokenGenerator;
        private readonly IHubContext<NotificacionesHub> _hub;

        public PersonasController(ClinicaFisioterapiaBD context, JwtTokenGenerator jwtTokenGenerator, IHubContext<NotificacionesHub> hub)
        {
            _context = context;
            _JwTokenGenerator = jwtTokenGenerator;
            _hub = hub;
        }

        // GET: api/Personas
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetPersona()
        {
            try
            {
                var personas = await _context.Persona
                    .Select(p => new
                    {
                        // Campos comunes de Persona
                        p.Id,
                        p.User,
                        p.Password,
                        p.Nombres,
                        p.Apellidos,
                        p.TipoDocumento,
                        p.DocumentoIdentidad,
                        p.Telefono,
                        p.Celular,
                        p.CorreoElectronico,
                        p.FechaNacimiento,
                        p.Genero,
                        p.Direccion,
                        p.Ciudad,
                        p.Departamento,
                        p.Activo,
                        p.FechaRegistro,
                        p.Rol,

                        // Campos específicos de Paciente - USANDO OPERADOR AS
                        EpsId = (p as Paciente) != null ? ((Paciente)p).EpsId : (int?)null,
                        IdSeguroMedico = (p as Paciente) != null ? ((Paciente)p).IdSeguroMedico : (int?)null,
                        NumeroDeAfiliacion = (p as Paciente) != null ? ((Paciente)p).NumeroDeAfiliacion : (int?)null,
                        TipoAfiliado = (p as Paciente) != null ? ((Paciente)p).TipoAfiliado : null,
                        EstadoAfiliacion = (p as Paciente) != null ? ((Paciente)p).EstadoAfiliacion : (bool?)null,
                        FechaAfiliacion = (p as Paciente) != null ? ((Paciente)p).FechaAfiliacion : (DateTime?)null,
                        Regimen = (p as Paciente) != null ? ((Paciente)p).Regimen : null,

                        // Campos específicos de Terapeuta - USANDO OPERADOR AS
                        NoLicencia = (p as Terapeuta) != null ? ((Terapeuta)p).NoLicencia : null,
                        TituloAcademico = (p as Terapeuta) != null ? ((Terapeuta)p).TituloAcademico : null,
                        AñosExperiencia = (p as Terapeuta) != null ? ((Terapeuta)p).AñosExperiencia : (int?)null,
                        FechaContratacion = (p as Terapeuta) != null ? ((Terapeuta)p).FechaContratacion : (DateTime?)null
                    })
                    .ToListAsync();

                return Ok(personas);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR en GetPersona: {ex.Message}");
                Console.WriteLine($" StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // GET: api/Personas/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetPersona(int id)
        {
            try
            {
                var persona = await _context.Persona
                    .Where(p => p.Id == id)
                    .Select(p => new
                    {
                        // Campos comunes de Persona
                        p.Id,
                        p.User,
                        p.Password,
                        p.Nombres,
                        p.Apellidos,
                        p.TipoDocumento,
                        p.DocumentoIdentidad,
                        p.Telefono,
                        p.Celular,
                        p.CorreoElectronico,
                        p.FechaNacimiento,
                        p.Genero,
                        p.Direccion,
                        p.Ciudad,
                        p.Departamento,
                        p.Activo,
                        p.FechaRegistro,
                        p.Rol,

                        // Campos específicos de Paciente - USANDO OPERADOR AS
                        EpsId = (p as Paciente) != null ? ((Paciente)p).EpsId : (int?)null,
                        IdSeguroMedico = (p as Paciente) != null ? ((Paciente)p).IdSeguroMedico : (int?)null,
                        NumeroDeAfiliacion = (p as Paciente) != null ? ((Paciente)p).NumeroDeAfiliacion : (int?)null,
                        TipoAfiliado = (p as Paciente) != null ? ((Paciente)p).TipoAfiliado : null,
                        EstadoAfiliacion = (p as Paciente) != null ? ((Paciente)p).EstadoAfiliacion : (bool?)null,
                        FechaAfiliacion = (p as Paciente) != null ? ((Paciente)p).FechaAfiliacion : (DateTime?)null,
                        Regimen = (p as Paciente) != null ? ((Paciente)p).Regimen : null,

                        // Campos específicos de Terapeuta - USANDO OPERADOR AS
                        NoLicencia = (p as Terapeuta) != null ? ((Terapeuta)p).NoLicencia : null,
                        TituloAcademico = (p as Terapeuta) != null ? ((Terapeuta)p).TituloAcademico : null,
                        AñosExperiencia = (p as Terapeuta) != null ? ((Terapeuta)p).AñosExperiencia : (int?)null,
                        FechaContratacion = (p as Terapeuta) != null ? ((Terapeuta)p).FechaContratacion : (DateTime?)null
                    })
                    .FirstOrDefaultAsync();

                if (persona == null)
                {
                    return NotFound();
                }

                return persona;
            }
            catch (Exception ex)
            {
                Console.WriteLine($" ERROR en GetPersona({id}): {ex.Message}");
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPut("Update/{id}")]
        public async Task<ActionResult<Persona>> PutActualizarPersona(int id, ActualizacionDto actualizacion)
        {
            Console.WriteLine($"Llegó solicitud de actualización a /api/Personas/Update/{id}");
            Console.WriteLine($" Datos recibidos: {System.Text.Json.JsonSerializer.Serialize(actualizacion)}");

            // Buscar la persona existente
            var personaExistente = await _context.Persona.FindAsync(id);
            if (personaExistente == null)
            {
                return NotFound("Persona no encontrada");
            }

            // Verificar que el rol no cambie
            if (personaExistente.Rol != actualizacion.Rol)
            {
                return BadRequest("No se puede cambiar el rol de una persona existente");
            }

            if (actualizacion.Rol == Rol.Terapeuta)
            {
                if (string.IsNullOrEmpty(actualizacion.NoLicencia))
                    ModelState.AddModelError("NoLicencia", "El campo NoLicencia es requerido para terapeutas.");

                if (string.IsNullOrEmpty(actualizacion.TituloAcademico))
                    ModelState.AddModelError("TituloAcademico", "El campo TituloAcademico es requerido para terapeutas.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Actualizar campos comunes
            personaExistente.Nombres = actualizacion.Nombres ?? "";
            personaExistente.Apellidos = actualizacion.Apellidos ?? "";
            personaExistente.TipoDocumento = actualizacion.TipoDocumento ?? "";
            personaExistente.DocumentoIdentidad = actualizacion.DocumentoIdentidad ?? "";
            personaExistente.Telefono = actualizacion.Telefono ?? "";
            personaExistente.Celular = actualizacion.Celular ?? "";
            personaExistente.CorreoElectronico = actualizacion.CorreoElectronico ?? "";
            personaExistente.FechaNacimiento = actualizacion.FechaNacimiento;
            personaExistente.Genero = actualizacion.Genero ?? "";
            personaExistente.Direccion = actualizacion.Direccion ?? "";
            personaExistente.Ciudad = actualizacion.Ciudad ?? "";
            personaExistente.Departamento = actualizacion.Departamento ?? "";
            personaExistente.Activo = actualizacion.Activo;

            // Actualizar campos específicos según el rol
            switch (actualizacion.Rol)
            {
                case Rol.Paciente:
                    var paciente = personaExistente as Paciente;
                    if (paciente != null)
                    {
                        paciente.IdSeguroMedico = actualizacion.IdSeguroMedico;
                        paciente.EpsId = actualizacion.EpsId;
                        paciente.NumeroDeAfiliacion = actualizacion.NumeroDeAfiliacion ?? 0;
                        paciente.TipoAfiliado = actualizacion.TipoAfiliado ?? "";
                        paciente.EstadoAfiliacion = actualizacion.EstadoAfiliacion ?? true;
                        paciente.FechaAfiliacion = actualizacion.FechaAfiliacion;
                        paciente.Regimen = actualizacion.Regimen ?? "";
                    }
                    break;

                case Rol.Terapeuta:
                    var terapeuta = personaExistente as Terapeuta;
                    if (terapeuta != null)
                    {
                        terapeuta.NoLicencia = actualizacion.NoLicencia ?? "";
                        terapeuta.TituloAcademico = actualizacion.TituloAcademico ?? "";
                        terapeuta.AñosExperiencia = actualizacion.AñosExperiencia ?? 0;
                        terapeuta.FechaContratacion = actualizacion.FechaContratacion ?? DateTime.Now;
                    }
                    break;

                case Rol.Administrador:
                    // Administrador no tiene campos adicionales
                    break;
            }

            try
            {
                await _context.SaveChangesAsync();
                Console.WriteLine($" Persona {id} actualizada exitosamente");
                return Ok(personaExistente);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($" Error al guardar cambios: {ex.Message}");
                return StatusCode(500, "Error interno del servidor al actualizar la persona");
            }
        }

        // PUT: api/Personas/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPersona(int id, Persona persona)
        {
            if (id != persona.Id)
            {
                return BadRequest();
            }

            _context.Entry(persona).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonaExists(id))
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

        // POST: api/Personas
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Persona>> PostPersona(Persona persona)
        {
            _context.Persona.Add(persona);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPersona", new { id = persona.Id }, persona);
        }

        [HttpPost("Register")]
        public async Task<ActionResult<Persona>> PostRegistroPersona(RegistroDto registro)
        {
            Console.WriteLine(" Llegó solicitud de registro a /api/Personas/Register");
            Console.WriteLine($" Datos recibidos: {System.Text.Json.JsonSerializer.Serialize(registro)}");
            Console.WriteLine($" Usuario autenticado: {User.Identity?.IsAuthenticated}");
            Console.WriteLine($" Nombre del usuario: {User.Identity?.Name}");

            bool existeAdmin = _context.Persona.Any(p => p.Rol == Rol.Administrador);
            Console.WriteLine($" Existe administrador: {existeAdmin}");

            if (registro.Rol != Rol.Administrador && !(User.Identity?.IsAuthenticated ?? false))
            {
                return Unauthorized("Debe autenticarse para registrar este tipo de usuario");
            }

            if (existeAdmin && !(User.Identity?.IsAuthenticated ?? false))
            {
                return Unauthorized("Debe autenticarse para registrar usuarios");
            }

            if (registro.Rol == Rol.Administrador && existeAdmin)
            {
                return BadRequest("Ya existe un administrador registrado");
            }

            // Validaciones existentes
            if (PersonaExistsByUser(registro.User))
                return BadRequest("El usuario ya existe");

            if (!string.IsNullOrEmpty(registro.DocumentoIdentidad)
                && PersonaExistsByDocumento(registro.DocumentoIdentidad))
            {
                return Conflict(new
                {
                    message = "Ya existe una persona registrada con este documento de identidad",
                    campo = "documentoIdentidad",
                    valor = registro.DocumentoIdentidad
                });
            }

            Console.WriteLine(" Pasó todas las validaciones, creando paciente...");

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registro.Password ?? "");

            Persona tipoUsuario;

            switch (registro.Rol)
            {
                case Rol.Paciente:
                    tipoUsuario = new Paciente
                    {
                        User = registro.User ?? "",
                        Password = passwordHash,
                        Nombres = registro.Nombres ?? "",
                        Apellidos = registro.Apellidos ?? "",
                        TipoDocumento = registro.TipoDocumento ?? "",
                        DocumentoIdentidad = registro.DocumentoIdentidad ?? "",
                        Telefono = registro.Telefono ?? "",
                        CorreoElectronico = registro.CorreoElectronico ?? "",
                        FechaNacimiento = registro.FechaNacimiento,
                        Genero = registro.Genero ?? "",
                        Direccion = registro.Direccion ?? "",
                        Ciudad = registro.Ciudad ?? "",
                        Departamento = registro.Departamento ?? "",
                        Activo = registro.Activo,
                        FechaRegistro = registro.FechaRegistro,
                        Rol = Rol.Paciente,
                        NumeroDeAfiliacion = registro.NumeroDeAfiliacion ?? 0,
                        TipoAfiliado = registro.TipoAfiliado ?? "",
                        EstadoAfiliacion = registro.EstadoAfiliacion ?? true,
                        FechaAfiliacion = registro.FechaAfiliacion,
                        Regimen = registro.Regimen ?? ""
                    };
                    break;

                case Rol.Terapeuta:
                    tipoUsuario = new Terapeuta
                    {
                        User = registro.User ?? "",
                        Password = passwordHash,
                        Nombres = registro.Nombres ?? "",
                        Apellidos = registro.Apellidos ?? "",
                        TipoDocumento = registro.TipoDocumento ?? "",
                        DocumentoIdentidad = registro.DocumentoIdentidad ?? "",
                        Telefono = registro.Telefono ?? "",
                        CorreoElectronico = registro.CorreoElectronico ?? "",
                        FechaNacimiento = registro.FechaNacimiento,
                        Genero = registro.Genero ?? "",
                        Direccion = registro.Direccion ?? "",
                        Ciudad = registro.Ciudad ?? "",
                        Departamento = registro.Departamento ?? "",
                        Activo = registro.Activo,
                        FechaRegistro = registro.FechaRegistro,
                        Rol = Rol.Terapeuta,
                        NoLicencia = registro.NoLicencia ?? "",
                        TituloAcademico = registro.TituloAcademico ?? "",
                        AñosExperiencia = registro.AñosExperiencia ?? 0,
                        FechaContratacion = registro.FechaContratacion ?? DateTime.Now
                    };
                    break;

                case Rol.Administrador:
                    tipoUsuario = new Administrador
                    {
                        User = registro.User ?? "",
                        Password = passwordHash,
                        Nombres = registro.Nombres ?? "",
                        Apellidos = registro.Apellidos ?? "",
                        Activo = registro.Activo,
                        FechaRegistro = registro.FechaRegistro,
                        Rol = Rol.Administrador
                    };
                    break;

                case Rol.Recepcionista:
                    tipoUsuario = new Recepcionista
                    {
                        User = registro.User ?? "",
                        Password = passwordHash,
                        Nombres = registro.Nombres ?? "",
                        Apellidos = registro.Apellidos ?? "",
                        Activo = registro.Activo,
                        FechaRegistro = registro.FechaRegistro,
                        Rol = Rol.Recepcionista

                    };
                    break;

                case Rol.Contador:
                    tipoUsuario = new Contador
                    {
                        User = registro.User ?? "",
                        Password = passwordHash,
                        Nombres = registro.Nombres ?? "",
                        Apellidos = registro.Apellidos ?? "",
                        Activo = registro.Activo,
                        FechaRegistro = registro.FechaRegistro,
                        Rol = Rol.Contador

                    };
                    break;

                case Rol.Supervisor:
                    tipoUsuario = new Supervisor
                    {
                        User = registro.User ?? "",
                        Password = passwordHash,
                        Nombres = registro.Nombres ?? "",
                        Apellidos = registro.Apellidos ?? "",
                        Activo = registro.Activo,
                        FechaRegistro = registro.FechaRegistro,
                        Rol = Rol.Supervisor

                    };
                    break;

                default:
                    return BadRequest("Rol no válido");
            }

            _context.Persona.Add(tipoUsuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPersona", new { id = tipoUsuario.Id }, new LoginResponseDto
            {
                User = tipoUsuario.User,
                Rol = tipoUsuario.Rol
            });
        }

        // POST: api/Personas/Login
        [HttpPost("Login")]
        public async Task<ActionResult<Persona>> PostLoginPersona(LoginDto login)
        {
            if (login?.User == null)
            {
                return BadRequest("Usuario o contraseña incorrectos");
            }

            var loginUser = _context.Persona.FirstOrDefault(u => u.User == login.User);

            if (loginUser == null || !BCrypt.Net.BCrypt.Verify(login.Password ?? "", loginUser.Password))
                return BadRequest("Usuario o contraseña incorrectos");

            var token = _JwTokenGenerator.GenerateToken(loginUser);

            await _hub.Clients.All.SendAsync("Notificacion", $"El usuario '{login.User}'"+ $" con rol '{loginUser.Rol}'" + " ha iniciado sesión.");
            

            return Ok(new
            {
                Id = loginUser.Id,
                Nombres = loginUser.Nombres,
                Apellidos = loginUser.Apellidos,
                Token = token
            });
        }

        // DELETE: api/Personas/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePersona(int id)
        {
            var persona = await _context.Persona.FindAsync(id);
            if (persona == null)
            {
                return NotFound();
            }

            _context.Persona.Remove(persona);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PersonaExists(int id)
        {
            return _context.Persona.Any(e => e.Id == id);
        }

        private bool PersonaExistsByUser(string? user)
        {
            if (string.IsNullOrEmpty(user))
                return false;

            return _context.Persona.Any(e => e.User == user);
        }

        private bool PersonaExistsByDocumento(string? documentoIdentidad)
        {
            if (string.IsNullOrEmpty(documentoIdentidad))
                return false;

            return _context.Persona.Any(e => e.DocumentoIdentidad == documentoIdentidad);
        }
    }
}