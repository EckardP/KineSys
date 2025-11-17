// Services/IAuthorizationService.cs
using ApiPrueba.Data;
using System.Security.Claims;
using ApiPrueba.Models;

namespace ApiPrueba.Services
{
    public interface IAuthorizationService
    {
        bool CanAccessResource(ClaimsPrincipal user, int resourceId, string resourceType);
        bool CanModifyResource(ClaimsPrincipal user, int resourceId, string resourceType);
        IQueryable<T> ApplyRoleBasedFilter<T>(IQueryable<T> query, ClaimsPrincipal user) where T : class;
    }

    public class AuthorizationService : IAuthorizationService
    {
        private readonly ClinicaFisioterapiaBD _context;

        public AuthorizationService(ClinicaFisioterapiaBD context)
        {
            _context = context;
        }

        public bool CanAccessResource(ClaimsPrincipal user, int resourceId, string resourceType)
        {
            var userRole = user.FindFirst(ClaimTypes.Role)?.Value;
            var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            if (userRole == "Administrador") return true;

            switch (resourceType.ToLower())
            {
                case "cita":
                    var cita = _context.Citas.Find(resourceId);
                    if (cita == null) return false;

                    if (userRole == "Paciente") return cita.IdPaciente == userId;
                    if (userRole == "Terapeuta") return cita.IdTerapeuta == userId;
                    break;

                case "paciente":
                    if (userRole == "Paciente") return resourceId == userId;
                    if (userRole == "Terapeuta")
                    {
                        return _context.Citas.Any(c => c.IdTerapeuta == userId && c.IdPaciente == resourceId);
                    }
                    break;

                case "terapeuta":
                    if (userRole == "Terapeuta") return resourceId == userId;
                    break;
            }

            return false;
        }

        public bool CanModifyResource(ClaimsPrincipal user, int resourceId, string resourceType)
        {
            var userRole = user.FindFirst(ClaimTypes.Role)?.Value;

            // Solo administradores pueden modificar ciertos recursos
            if (resourceType.ToLower() == "paciente" || resourceType.ToLower() == "terapeuta")
            {
                return userRole == "Administrador";
            }

            return CanAccessResource(user, resourceId, resourceType);
        }

        public IQueryable<T> ApplyRoleBasedFilter<T>(IQueryable<T> query, ClaimsPrincipal user) where T : class
        {
            var userRole = user.FindFirst(ClaimTypes.Role)?.Value;
            var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            // Implementar lógica de filtrado específica para cada tipo
            // Esto es un ejemplo genérico
            return query;
        }
    }
}