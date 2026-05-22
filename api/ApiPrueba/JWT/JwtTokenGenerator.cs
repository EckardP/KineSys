using ApiPrueba.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Globalization;

namespace ApiPrueba.JWT
{
    //Guarda en token en config
    public class JwtTokenGenerator
    {
        private readonly IConfiguration _config;

        public JwtTokenGenerator(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken (Persona user)
        {
            var jwtKey = _config["JwtSettings:Key"];
            if (string.IsNullOrWhiteSpace(jwtKey))
            {
                throw new InvalidOperationException("JwtSettings:Key no esta configurado.");
            }

            var key = Encoding.UTF8.GetBytes(jwtKey);

            if (!double.TryParse(_config["JwtSettings:ExpireInMinutes"], NumberStyles.Number, CultureInfo.InvariantCulture, out var expireInMinutes))
            {
                throw new InvalidOperationException("JwtSettings:ExpireInMinutes no esta configurado correctamente.");
            }

            // Claims incluyendo el ROL
            var Claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.User ?? string.Empty),
                new Claim("role", user.Rol.ToString()),
                new Claim(ClaimTypes.Role, user.Rol.ToString()),
                new Claim("FullName", $"{user.Nombres} {user.Apellidos}"),
                new Claim("Email", user.CorreoElectronico ?? string.Empty)
            };

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: Claims,
                expires: DateTime.UtcNow.AddMinutes(expireInMinutes),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256
                    )
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
