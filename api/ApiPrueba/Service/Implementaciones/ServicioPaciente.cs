using ApiPrueba.data;
using ApiPrueba.DTO;
using ApiPrueba.Models;
using ApiPrueba.Service.Interfaces;
using ApiPrueba.Service.Interfaces.ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Service.Implementaciones
{
    public class ServicioPaciente : IServicioPaciente
    {
        private readonly ClinicaFisioterapiaBD _contexto;

        public ServicioPaciente(ClinicaFisioterapiaBD contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<PacienteDTO>> ObtenerTodos()
        {
            return await _contexto.Pacientes
                .Select(p => new PacienteDTO
                {
                    Id = p.Id,
                    NombreCompleto = p.NombreCompleto,
                    //Documento = p.Documento,
                    Telefono = p.Telefono,
                    Direccion = p.Direccion,
                    FechaNacimiento = p.FechaNacimiento
                })
                .ToListAsync();
        }

        public async Task<PacienteDTO> ObtenerPorId(int id)
        {
            var p = await _contexto.Pacientes.FindAsync(id);
            if (p == null) return null;

            return new PacienteDTO
            {
                Id = p.Id,
                NombreCompleto = p.NombreCompleto,
                //Documento = p.Documento,
                Telefono = p.Telefono,
                Direccion = p.Direccion,
                FechaNacimiento = p.FechaNacimiento
            };
        }

        public async Task Crear(PacienteDTO dto)
        {
            var paciente = new Paciente
            {
                NombreCompleto = dto.NombreCompleto,
                //Documento = dto.Documento,
                Telefono = dto.Telefono,
                Direccion = dto.Direccion,
                FechaNacimiento = (DateTime)dto.FechaNacimiento
            };

            _contexto.Pacientes.Add(paciente);
            await _contexto.SaveChangesAsync();
        }

        public async Task<bool> Actualizar(PacienteDTO dto)
        {
            var paciente = await _contexto.Pacientes.FindAsync(dto.Id);
            if (paciente == null) return false;

            paciente.NombreCompleto = dto.NombreCompleto;
            //paciente.Documento = dto.Documento;
            paciente.Telefono = dto.Telefono;
            paciente.Direccion = dto.Direccion;
            paciente.FechaNacimiento = (DateTime)dto.FechaNacimiento;

            await _contexto.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            var paciente = await _contexto.Pacientes.FindAsync(id);
            if (paciente == null) return false;

            _contexto.Pacientes.Remove(paciente);
            await _contexto.SaveChangesAsync();
            return true;
        }
    }
}
