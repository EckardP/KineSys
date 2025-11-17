// Filters/AutoFilterAttribute.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ApiPrueba.Filters
{
    public class AutoFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Result is ObjectResult objectResult && objectResult.Value is IQueryable<object> queryable)
            {
                var user = context.HttpContext.User;
                var userRole = user.FindFirst(ClaimTypes.Role)?.Value;
                var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                // Aplicar filtros automáticamente según el rol
                var filteredData = ApplyRoleBasedFiltering(queryable, userRole, userId);
                objectResult.Value = filteredData;
            }

            base.OnActionExecuted(context);
        }

        private IQueryable<object> ApplyRoleBasedFiltering(IQueryable<object> data, string userRole, string userId)
        {
            // Aquí implementas la lógica de filtrado específica para cada entidad
            // Esto es un ejemplo genérico, necesitarás adaptarlo a tus modelos

            switch (userRole)
            {
                case "Paciente":
                    // Filtrar datos que pertenecen al paciente
                    return data; // Implementar lógica específica

                case "Terapeuta":
                    // Filtrar datos relacionados con el terapeuta
                    return data; // Implementar lógica específica

                case "Administrador":
                    // Mostrar todos los datos
                    return data;

                default:
                    return data;
            }
        }
    }
}