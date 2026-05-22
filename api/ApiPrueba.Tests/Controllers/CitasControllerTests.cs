using ApiPrueba.Controllers;
using ApiPrueba.Data;
using ApiPrueba.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiPrueba.Tests.Controllers;

/// <summary>
/// Pruebas de integración para CitasController usando base de datos en memoria.
/// La BD InMemory no valida FK, por lo que se pueden insertar citas sin personas reales.
/// </summary>
public class CitasControllerTests : IDisposable
{
    private readonly ClinicaFisioterapiaBD _context;
    private readonly CitasController _controller;

    public CitasControllerTests()
    {
        var options = new DbContextOptionsBuilder<ClinicaFisioterapiaBD>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new ClinicaFisioterapiaBD(options);
        _controller = new CitasController(_context);
    }

    public void Dispose() => _context.Dispose();

    // ── Helpers ─────────────────────────────────────────────────
    private static Cita CrearCita(int id, string estado, int idPaciente = 1, int idTerapeuta = 2) => new()
    {
        IdCita = id,
        Estado = estado,
        IdPaciente = idPaciente,
        IdTerapeuta = idTerapeuta,
        DuracionProgramadaMin = 30,
        Confirmada = false,
        Motivo = "Dolor de espalda",
    };

    private async Task SeedAsync(params Cita[] citas)
    {
        _context.Citas.AddRange(citas);
        await _context.SaveChangesAsync();
    }

    // ─────────────────────────────────────────────────────────────
    // GET /api/Citas
    // ─────────────────────────────────────────────────────────────
    [Fact]
    public async Task GetCitas_SinDatos_RetornaListaVacia()
    {
        var resultado = await _controller.GetCitas();
        resultado.Value.Should().BeEmpty();
    }

    [Fact]
    public async Task GetCitas_ConDatos_RetornaTodasLasCitas()
    {
        await SeedAsync(
            CrearCita(1, "Programada"),
            CrearCita(2, "Completada"),
            CrearCita(3, "Cancelada")
        );

        var resultado = await _controller.GetCitas();

        resultado.Value.Should().HaveCount(3);
    }

    [Fact]
    public async Task GetCitas_RetornaEstadosCorrectamente()
    {
        await SeedAsync(CrearCita(1, "Confirmada"));

        var resultado = await _controller.GetCitas();

        resultado.Value!.First().Estado.Should().Be("Confirmada");
    }

    // ─────────────────────────────────────────────────────────────
    // GET /api/Citas/{id}
    // ─────────────────────────────────────────────────────────────
    [Fact]
    public async Task GetCita_ConIdExistente_RetornaCitaCorrecta()
    {
        await SeedAsync(CrearCita(10, "Programada", idPaciente: 5));

        var resultado = await _controller.GetCita(10);

        resultado.Value.Should().NotBeNull();
        resultado.Value!.IdCita.Should().Be(10);
        resultado.Value.IdPaciente.Should().Be(5);
    }

    [Fact]
    public async Task GetCita_ConIdInexistente_RetornaNotFound()
    {
        var resultado = await _controller.GetCita(9999);

        resultado.Result.Should().BeOfType<NotFoundResult>();
    }

    // ─────────────────────────────────────────────────────────────
    // POST /api/Citas
    // ─────────────────────────────────────────────────────────────
    [Fact]
    public async Task PostCita_CitaValida_Retorna201YPersisteDatos()
    {
        var nueva = new Cita
        {
            Estado = "Programada",
            IdPaciente = 1,
            IdTerapeuta = 2,
            DuracionProgramadaMin = 45,
            Confirmada = false,
        };

        var resultado = await _controller.PostCita(nueva);

        var created = resultado.Result as CreatedAtActionResult;
        created.Should().NotBeNull();
        created!.StatusCode.Should().Be(201);
        _context.Citas.Should().HaveCount(1);
    }

    [Fact]
    public async Task PostCita_AsignaIdAutomaticamente()
    {
        var nueva = new Cita { Estado = "Programada", IdPaciente = 1, IdTerapeuta = 2, DuracionProgramadaMin = 30 };

        var resultado = await _controller.PostCita(nueva);

        var created = resultado.Result as CreatedAtActionResult;
        var citaCreada = created!.Value as Cita;
        citaCreada!.IdCita.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task PostCita_PersisteCamposCorrectamente()
    {
        var nueva = new Cita
        {
            Estado = "Programada",
            IdPaciente = 7,
            IdTerapeuta = 3,
            DuracionProgramadaMin = 60,
            Motivo = "Rehabilitación de rodilla",
            PrecioCita = 95000m,
        };

        await _controller.PostCita(nueva);

        var enBD = await _context.Citas.FirstAsync();
        enBD.Motivo.Should().Be("Rehabilitación de rodilla");
        enBD.PrecioCita.Should().Be(95000m);
    }

    // ─────────────────────────────────────────────────────────────
    // PUT /api/Citas/{id}
    // ─────────────────────────────────────────────────────────────
    [Fact]
    public async Task PutCita_ActualizaEstado_RetornaNoContent()
    {
        await SeedAsync(CrearCita(5, "Programada"));
        // Desacoplamos el tracking antes de actualizar
        _context.Entry(_context.Citas.Find(5)!).State = EntityState.Detached;

        var actualizada = CrearCita(5, "Confirmada");
        var resultado = await _controller.PutCita(5, actualizada);

        resultado.Should().BeOfType<NoContentResult>();
        var enBD = await _context.Citas.FindAsync(5);
        enBD!.Estado.Should().Be("Confirmada");
    }

    [Fact]
    public async Task PutCita_IdNoCoincideConBody_RetornaBadRequest()
    {
        await SeedAsync(CrearCita(1, "Programada"));

        var cita = CrearCita(99, "Programada");
        var resultado = await _controller.PutCita(1, cita);

        resultado.Should().BeOfType<BadRequestResult>();
    }

    [Fact]
    public async Task PutCita_IdInexistente_RetornaNotFound()
    {
        var cita = CrearCita(500, "Completada");
        var resultado = await _controller.PutCita(500, cita);

        resultado.Should().BeOfType<NotFoundResult>();
    }

    // ─────────────────────────────────────────────────────────────
    // DELETE /api/Citas/{id}
    // ─────────────────────────────────────────────────────────────
    [Fact]
    public async Task DeleteCita_ConIdExistente_EliminaYRetornaNoContent()
    {
        await SeedAsync(CrearCita(1, "Programada"), CrearCita(2, "Completada"));

        var resultado = await _controller.DeleteCita(1);

        resultado.Should().BeOfType<NoContentResult>();
        _context.Citas.Should().HaveCount(1);
        (await _context.Citas.FindAsync(1)).Should().BeNull();
    }

    [Fact]
    public async Task DeleteCita_ConIdInexistente_RetornaNotFound()
    {
        var resultado = await _controller.DeleteCita(9999);

        resultado.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task DeleteCita_NoAfectaOtrasCitas()
    {
        await SeedAsync(CrearCita(1, "Programada"), CrearCita(2, "Confirmada"), CrearCita(3, "Completada"));

        await _controller.DeleteCita(2);

        _context.Citas.Should().HaveCount(2);
        (await _context.Citas.FindAsync(1)).Should().NotBeNull();
        (await _context.Citas.FindAsync(3)).Should().NotBeNull();
    }
}
