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

namespace ApiPrueba.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonasController : ControllerBase
    {
        private readonly ClinicaFisioterapiaBD _context;
        private readonly JwtTokenGenerator _JwTokenGenerator;

        public PersonasController(ClinicaFisioterapiaBD context, JwtTokenGenerator jwtTokenGenerator)
        {
            _context = context;
            _JwTokenGenerator = jwtTokenGenerator;
        }

        // GET: api/Personas
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Persona>>> GetPersona()
        {
            return await _context.Persona.ToListAsync();
        }

        // GET: api/Personas/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Persona>> GetPersona(int id)
        {
            var persona = await _context.Persona.FindAsync(id);

            if (persona == null)
            {
                return NotFound();
            }

            return persona;
        }

        // PUT: api/Personas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Persona>> PostPersona(Persona persona)
        {
            _context.Persona.Add(persona);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPersona", new { id = persona.Id }, persona);
        }


        // POST: api/Personas/Register
        [Authorize]
        [HttpPost("Register")]
        public async Task<ActionResult<Persona>> PostRegistroPersona(RegistroDto registro)
        {
            if (PersonaExistsByUser(registro.User))
                return BadRequest("El usuario ya existe");

            if (!string.IsNullOrEmpty(registro.DocumentoIdentidad) && PersonaExistsByDocumento(registro.DocumentoIdentidad))
                return Conflict(new
                {
                    message = "Ya existe una persona registrada con este documento de identidad",
                    campo = "documentoIdentidad",
                    valor = registro.DocumentoIdentidad
                });

            var PasswordHash = BCrypt.Net.BCrypt.HashPassword(registro.Password);

            Persona tipoUsuario;

            switch (registro.Rol)
            {
                case Rol.Paciente:
                    tipoUsuario = new Paciente
                    {
                        User = registro.User,
                        Password = PasswordHash,
                        Nombres = registro.Nombres,
                        Apellidos = registro.Apellidos,
                        TipoDocumento = registro.TipoDocumento,
                        DocumentoIdentidad = registro.DocumentoIdentidad,
                        Telefono = registro.Telefono,
                        CorreoElectronico = registro.CorreoElectronico,
                        FechaNacimiento = registro.FechaNacimiento,
                        Genero = registro.Genero,
                        Direccion = registro.Direccion,
                        Rol = Rol.Paciente
                    };
                    break;
                case Rol.Terapeuta:
                    tipoUsuario = new Terapeuta
                    {
                        User = registro.User,
                        Password = PasswordHash,
                        Nombres = registro.Nombres,
                        Apellidos = registro.Apellidos,
                        TipoDocumento = registro.TipoDocumento,
                        DocumentoIdentidad = registro.DocumentoIdentidad,
                        Telefono = registro.Telefono,
                        CorreoElectronico = registro.CorreoElectronico,
                        FechaNacimiento = registro.FechaNacimiento,
                        Genero = registro.Genero,
                        Direccion = registro.Direccion,
                        Rol = Rol.Terapeuta
                    };
                    break;
                //case Rol.Administrador:
                //    tipoUsuario = new Administrador
                //    {
                //        User = registro.User,
                //        Password = PasswordHash,
                //        Nombres = registro.Nombres,
                //        Apellidos = registro.Apellidos,
                //        Rol = Rol.Administrador
                //    };
                //    break;

                case Rol.Despachadora:
                    return BadRequest("Quizás.... algún día... tengamos una depachadora... de pronto así mi hijo se case... ojalá");

                default:
                    return BadRequest("Rol no válido");

            }

            _context.Persona.Add(tipoUsuario);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PersonaExistsByUser(registro.User))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPersona", new { id = tipoUsuario.Id }, new LoginResponseDto
            {
               // Id = tipoUsuario.Id,
                User = tipoUsuario.User,
               // Nombres = tipoUsuario.Nombres,
                //Apellidos = tipoUsuario.Apellidos,
                Rol = tipoUsuario.Rol
            });


        }

        // POST: api/Personas/Login
        [HttpPost("Login")]
        public async Task<ActionResult<Persona>> PostLoginPersona(LoginDto login)
        {
            var loginUser = _context.Persona.FirstOrDefault(u => u.User == login.User);
                

            if (loginUser == null || !BCrypt.Net.BCrypt.Verify(login.Password, loginUser.Password))
                return BadRequest("Usuario o contraseña incorrectos");

            var token = _JwTokenGenerator.GenerateToken(loginUser);

            return Ok(new
            {
                Id = loginUser.Id,
                Nombres = loginUser.Nombres,
                Apellidos = loginUser.Apellidos,
                //User = loginUser.User,
                Rol = loginUser.Rol,
                Token = token
            });

            //return Ok(new LoginResponseDto
            //{
            //    Id = loginUser.Id,
            //    User = loginUser.User,
            //    Nombres = loginUser.Nombres,
            //    Apellidos = loginUser.Apellidos,
            //    Rol = loginUser.Rol

            //});   

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

        private bool PersonaExistsByUser(string user)
        {
            return _context.Persona.Any(e => e.User == user);
        }

        private bool PersonaExistsByDocumento(string documentoIdentidad)
        {
            return _context.Persona.Any(e => e.DocumentoIdentidad == documentoIdentidad);
        }
    }
}
