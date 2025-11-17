// Filters/AuthorizeByRoleAttribute.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace ApiPrueba.Filters
{
    // Filtro personalizado para autorización por roles
    public class AuthorizeByRoleAttribute : Attribute, IAuthorizationFilter
    {
        private readonly string[] _allowedRoles;

        public AuthorizeByRoleAttribute(params string[] roles)
        {
            _allowedRoles = roles;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;

            if (!user.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var userRole = user.FindFirst(ClaimTypes.Role)?.Value;

            if (userRole == null || !_allowedRoles.Contains(userRole))
            {
                context.Result = new ForbidResult("No tienes permisos para acceder a este recurso");
            }
        }
    }

    // Filtro específico para validar propiedad (cuando un usuario solo puede acceder a sus propios datos)
    public class ValidateUserOwnershipAttribute : Attribute, IActionFilter
    {
        private readonly string _idParameterName;

        public ValidateUserOwnershipAttribute(string idParameterName = "id")
        {
            _idParameterName = idParameterName;
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var user = context.HttpContext.User;
            var userRole = user.FindFirst(ClaimTypes.Role)?.Value ??
                           user.FindFirst("role")?.Value;

            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Administradores pueden acceder a todo
            if (userRole == "Administrador")
                return;

            // Obtener el ID del recurso que se está intentando acceder
            if (context.ActionArguments.TryGetValue(_idParameterName, out var idValue))
            {
                var resourceId = idValue?.ToString();

                // Para pacientes y terapeutas, verificar que el ID del recurso coincida con su ID
                if ((userRole == "Paciente" || userRole == "Terapeuta") && resourceId != userId)
                {
                    context.Result = new ForbidResult("No tienes permisos para acceder a este recurso");
                }
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // No necesitamos hacer nada después de la ejecución
        }
    }
}