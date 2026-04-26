using ApiPrueba.Models;
using FluentAssertions;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace ApiPrueba.Tests.Models;

/// <summary>
/// Pruebas sobre el modelo Cita: validaciones, anotaciones, valores por defecto.
/// </summary>
public class CitaModelTests
{
    // ─────────────────────────────────────────────────────────────
    // Estructura del modelo
    // ─────────────────────────────────────────────────────────────
    [Fact]
    public void Cita_PropiededadIdCita_TieneAtributoKey()
    {
        var propiedad = typeof(Cita).GetProperty(nameof(Cita.IdCita));
        propiedad!.GetCustomAttribute<KeyAttribute>().Should().NotBeNull();
    }

    [Fact]
    public void Cita_PropiedadTipoAtencion_TieneLongitudMaxima50()
    {
        var propiedad = typeof(Cita).GetProperty(nameof(Cita.TipoAtencion));
        var attr = propiedad!.GetCustomAttribute<StringLengthAttribute>();
        attr.Should().NotBeNull();
        attr!.MaximumLength.Should().Be(50);
    }

    // ─────────────────────────────────────────────────────────────
    // Valores por defecto y asignación
    // ─────────────────────────────────────────────────────────────
    [Fact]
    public void Cita_AlertasCollection_InicializaComoListaVacia()
    {
        var cita = new Cita();
        cita.Alertas.Should().NotBeNull().And.BeEmpty();
    }

    [Fact]
    public void Cita_Confirmada_DefaultEsFalse()
    {
        var cita = new Cita();
        cita.Confirmada.Should().BeFalse();
    }

    [Theory]
    [InlineData("Programada")]
    [InlineData("Confirmada")]
    [InlineData("En Progreso")]
    [InlineData("Completada")]
    [InlineData("Cancelada")]
    [InlineData("Inasistencia")]
    public void Cita_EstadoAcepta_ValoresComunesDelSistema(string estado)
    {
        var cita = new Cita { Estado = estado };
        cita.Estado.Should().Be(estado);
    }

    [Fact]
    public void Cita_PrecioCita_AceptaDecimales()
    {
        var cita = new Cita { PrecioCita = 85000.50m };
        cita.PrecioCita.Should().Be(85000.50m);
    }

    [Fact]
    public void Cita_CamposOpcionales_SonNullables()
    {
        var cita = new Cita
        {
            IdCita = 1,
            IdPaciente = 1,
            IdTerapeuta = 2,
            DuracionProgramadaMin = 30
        };

        cita.HoraInicioReal.Should().BeNull();
        cita.HoraFinReal.Should().BeNull();
        cita.CheckIn.Should().BeNull();
        cita.CheckOut.Should().BeNull();
        cita.Estado.Should().BeNull();
        cita.PrecioCita.Should().BeNull();
        cita.Copago.Should().BeNull();
    }

    // ─────────────────────────────────────────────────────────────
    // Modelo Persona / Rol
    // ─────────────────────────────────────────────────────────────
    [Fact]
    public void Rol_ValoresNumericos_CoincidenConEspecificacion()
    {
        ((int)Rol.Paciente).Should().Be(1);
        ((int)Rol.Terapeuta).Should().Be(2);
        ((int)Rol.Administrador).Should().Be(3);
    }

    [Fact]
    public void Rol_ContieneExactamenteTresValores()
    {
        Enum.GetValues<Rol>().Should().HaveCount(3);
    }
}
