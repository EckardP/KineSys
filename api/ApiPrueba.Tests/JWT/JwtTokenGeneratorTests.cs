using ApiPrueba.JWT;
using ApiPrueba.Models;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Moq;
using System.IdentityModel.Tokens.Jwt;

namespace ApiPrueba.Tests.JWT;

public class JwtTokenGeneratorTests
{
    private readonly JwtTokenGenerator _generator;

    public JwtTokenGeneratorTests()
    {
        var configMock = new Mock<IConfiguration>();
        // Clave de 32+ caracteres para HMAC-SHA256
        configMock.Setup(c => c["JwtSettings:Key"]).Returns(new string('K', 64));
        configMock.Setup(c => c["JwtSettings:Issuer"]).Returns("KineSys-Tests");
        configMock.Setup(c => c["JwtSettings:Audience"]).Returns("KineSys-Frontend");
        configMock.Setup(c => c["JwtSettings:ExpireInMinutes"]).Returns("60");

        _generator = new JwtTokenGenerator(configMock.Object);
    }

    // ── Helpers ────────────────────────────────────────────────
    private static Terapeuta CrearTerapeuta(int id = 1, string user = "terapeuta1") => new()
    {
        Id = id,
        User = user,
        Nombres = "Juan",
        Apellidos = "Pérez",
        CorreoElectronico = "juan@clinica.com",
        Rol = Rol.Terapeuta,
        Activo = true,
        FechaNacimiento = new DateTime(1990, 1, 1),
        FechaRegistro = DateTime.UtcNow,
    };

    private static Administrador CrearAdministrador() => new()
    {
        Id = 99,
        User = "admin",
        Nombres = "Admin",
        Apellidos = "Sistema",
        CorreoElectronico = "admin@clinica.com",
        Rol = Rol.Administrador,
        Activo = true,
        FechaNacimiento = new DateTime(1985, 6, 15),
        FechaRegistro = DateTime.UtcNow,
    };

    // ─────────────────────────────────────────────────────────────
    // Estructura del token
    // ─────────────────────────────────────────────────────────────
    [Fact]
    public void GenerateToken_ConPersonaValida_RetornaStringNoVacio()
    {
        var token = _generator.GenerateToken(CrearTerapeuta());
        token.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public void GenerateToken_RetornaFormatoJWT_TresPartesSeparadasPorPunto()
    {
        var token = _generator.GenerateToken(CrearTerapeuta());
        var partes = token.Split('.');
        partes.Should().HaveCount(3, "un JWT válido tiene header.payload.signature");
    }

    [Fact]
    public void GenerateToken_RetornaTokenLegible_PorJwtSecurityTokenHandler()
    {
        var token = _generator.GenerateToken(CrearTerapeuta());
        var handler = new JwtSecurityTokenHandler();
        handler.CanReadToken(token).Should().BeTrue();
    }

    // ─────────────────────────────────────────────────────────────
    // Claims del token
    // ─────────────────────────────────────────────────────────────
    [Fact]
    public void GenerateToken_Incluye_FullName_ConNombreYApellido()
    {
        var persona = CrearTerapeuta();
        var token = _generator.GenerateToken(persona);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        var fullName = jwt.Claims.FirstOrDefault(c => c.Type == "FullName")?.Value;
        fullName.Should().Be($"{persona.Nombres} {persona.Apellidos}");
    }

    [Fact]
    public void GenerateToken_Incluye_Email_CorreoElectronico()
    {
        var persona = CrearTerapeuta();
        var token = _generator.GenerateToken(persona);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        var email = jwt.Claims.FirstOrDefault(c => c.Type == "Email")?.Value;
        email.Should().Be(persona.CorreoElectronico);
    }

    [Fact]
    public void GenerateToken_Incluye_NameIdentifier_ConIdDePersona()
    {
        var persona = CrearTerapeuta(id: 42);
        var token = _generator.GenerateToken(persona);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        // NameIdentifier usa el namespace completo de ASP.NET Claims
        var idClaim = jwt.Claims.FirstOrDefault(c =>
            c.Type.EndsWith("/nameidentifier") || c.Type == "nameid")?.Value;
        idClaim.Should().Be("42");
    }

    [Fact]
    public void GenerateToken_Incluye_RolCorrecto_ParaTerapeuta()
    {
        var token = _generator.GenerateToken(CrearTerapeuta());
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        var rolClaim = jwt.Claims.FirstOrDefault(c => c.Type == "role")?.Value;
        rolClaim.Should().Be(Rol.Terapeuta.ToString());
    }

    [Fact]
    public void GenerateToken_Incluye_RolCorrecto_ParaAdministrador()
    {
        var token = _generator.GenerateToken(CrearAdministrador());
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        var rolClaim = jwt.Claims.FirstOrDefault(c => c.Type == "role")?.Value;
        rolClaim.Should().Be(Rol.Administrador.ToString());
    }

    // ─────────────────────────────────────────────────────────────
    // Expiración
    // ─────────────────────────────────────────────────────────────
    [Fact]
    public void GenerateToken_FechaExpiracion_EsAproximadamente60MinutosDespues()
    {
        var ahora = DateTime.UtcNow;
        var token = _generator.GenerateToken(CrearTerapeuta());
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        jwt.ValidTo.Should().BeAfter(ahora.AddMinutes(55));
        jwt.ValidTo.Should().BeBefore(ahora.AddMinutes(65));
    }

    [Fact]
    public void GenerateToken_TokenNoEstaExpirado_AlMomentoDeGenerarse()
    {
        var token = _generator.GenerateToken(CrearTerapeuta());
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        jwt.ValidTo.Should().BeAfter(DateTime.UtcNow);
    }

    // ─────────────────────────────────────────────────────────────
    // Unicidad
    // ─────────────────────────────────────────────────────────────
    [Fact]
    public void GenerateToken_TokensDiferentes_ParaPersonasDiferentes()
    {
        var t1 = _generator.GenerateToken(CrearTerapeuta(id: 1, user: "user1"));
        var t2 = _generator.GenerateToken(CrearTerapeuta(id: 2, user: "user2"));

        t1.Should().NotBe(t2);
    }
}
