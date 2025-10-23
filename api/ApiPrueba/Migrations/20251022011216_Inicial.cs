using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class Inicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Equipos",
                columns: table => new
                {
                    IdEquipo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreEquipo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Cantidad = table.Column<int>(type: "int", nullable: false),
                    Ubicacion = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipos", x => x.IdEquipo);
                });

            migrationBuilder.CreateTable(
                name: "Especialidades",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Especialidades", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProtocoloTratamientos",
                columns: table => new
                {
                    IdProtocolo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    NumeroSesiones = table.Column<int>(type: "int", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    DuracionPorSesionMin = table.Column<int>(type: "int", nullable: false),
                    Recomendaciones = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProtocoloTratamientos", x => x.IdProtocolo);
                });

            migrationBuilder.CreateTable(
                name: "SegurosMedicos",
                columns: table => new
                {
                    IdSeguro = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreAseguradora = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NumeroPoliza = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Cobertura = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SegurosMedicos", x => x.IdSeguro);
                });

            migrationBuilder.CreateTable(
                name: "TipoTerapias",
                columns: table => new
                {
                    IdTipoTerapia = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoTerapias", x => x.IdTipoTerapia);
                });

            migrationBuilder.CreateTable(
                name: "EquiposSesion",
                columns: table => new
                {
                    IdEquipoSesion = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdProtocolo = table.Column<int>(type: "int", nullable: true),
                    IdEquipo = table.Column<int>(type: "int", nullable: false),
                    CantidadUsada = table.Column<int>(type: "int", nullable: false),
                    Observaciones = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquiposSesion", x => x.IdEquipoSesion);
                    table.ForeignKey(
                        name: "FK_EquiposSesion_Equipos_IdEquipo",
                        column: x => x.IdEquipo,
                        principalTable: "Equipos",
                        principalColumn: "IdEquipo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EquiposSesion_ProtocoloTratamientos_IdProtocolo",
                        column: x => x.IdProtocolo,
                        principalTable: "ProtocoloTratamientos",
                        principalColumn: "IdProtocolo");
                });

            migrationBuilder.CreateTable(
                name: "Persona",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreCompleto = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DocumentoIdentidad = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CorreoElectronico = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TipoPersona = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    FechaNacimiento = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Genero = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Direccion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HistorialMedico = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdSeguroMedico = table.Column<int>(type: "int", nullable: true),
                    SeguroMedicoIdSeguro = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Persona", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Persona_SegurosMedicos_SeguroMedicoIdSeguro",
                        column: x => x.SeguroMedicoIdSeguro,
                        principalTable: "SegurosMedicos",
                        principalColumn: "IdSeguro");
                });

            migrationBuilder.CreateTable(
                name: "ProtocoloTipoTerapias",
                columns: table => new
                {
                    IdProtocoloTipoTerapia = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdProtocolo = table.Column<int>(type: "int", nullable: false),
                    IdTipoTerapia = table.Column<int>(type: "int", nullable: false),
                    NumeroSesionesSugeridas = table.Column<int>(type: "int", nullable: false),
                    DuracionMinutosSugerida = table.Column<int>(type: "int", nullable: false),
                    OrdenSecuencia = table.Column<int>(type: "int", nullable: false),
                    Instrucciones = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProtocoloTipoTerapias", x => x.IdProtocoloTipoTerapia);
                    table.ForeignKey(
                        name: "FK_ProtocoloTipoTerapias_ProtocoloTratamientos_IdProtocolo",
                        column: x => x.IdProtocolo,
                        principalTable: "ProtocoloTratamientos",
                        principalColumn: "IdProtocolo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProtocoloTipoTerapias_TipoTerapias_IdTipoTerapia",
                        column: x => x.IdTipoTerapia,
                        principalTable: "TipoTerapias",
                        principalColumn: "IdTipoTerapia",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContactosEmergencia",
                columns: table => new
                {
                    IdContacto = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdPaciente = table.Column<int>(type: "int", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Parentesco = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TelefonoPrincipal = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    TelefonoAlterno = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Observaciones = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactosEmergencia", x => x.IdContacto);
                    table.ForeignKey(
                        name: "FK_ContactosEmergencia_Persona_IdPaciente",
                        column: x => x.IdPaciente,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DisponibilidadesTerapeutas",
                columns: table => new
                {
                    IdDisponibilidad = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdTerapeuta = table.Column<int>(type: "int", nullable: false),
                    DiaSemana = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    HoraInicio = table.Column<TimeSpan>(type: "time", nullable: false),
                    HoraFin = table.Column<TimeSpan>(type: "time", nullable: false),
                    Disponible = table.Column<bool>(type: "bit", nullable: false),
                    TipoAmbiente = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DisponibilidadesTerapeutas", x => x.IdDisponibilidad);
                    table.ForeignKey(
                        name: "FK_DisponibilidadesTerapeutas_Persona_IdTerapeuta",
                        column: x => x.IdTerapeuta,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DocumentosPaciente",
                columns: table => new
                {
                    IdDocumento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdPaciente = table.Column<int>(type: "int", nullable: false),
                    TipoDocumento = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    NombreArchivo = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Ruta = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    MimeType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FechaSubida = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SubidoPor = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentosPaciente", x => x.IdDocumento);
                    table.ForeignKey(
                        name: "FK_DocumentosPaciente_Persona_IdPaciente",
                        column: x => x.IdPaciente,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EvolucionesPaciente",
                columns: table => new
                {
                    IdEvolucion = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdPaciente = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Indicador = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Valor = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvolucionesPaciente", x => x.IdEvolucion);
                    table.ForeignKey(
                        name: "FK_EvolucionesPaciente_Persona_IdPaciente",
                        column: x => x.IdPaciente,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TerapeutaEspecialidades",
                columns: table => new
                {
                    IdTerapeutaEspecialidad = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdTerapeuta = table.Column<int>(type: "int", nullable: false),
                    IdEspecialidad = table.Column<int>(type: "int", nullable: false),
                    FechaCertificacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NumeroCertificado = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    EsPrincipal = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TerapeutaEspecialidades", x => x.IdTerapeutaEspecialidad);
                    table.ForeignKey(
                        name: "FK_TerapeutaEspecialidades_Especialidades_IdEspecialidad",
                        column: x => x.IdEspecialidad,
                        principalTable: "Especialidades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TerapeutaEspecialidades_Persona_IdTerapeuta",
                        column: x => x.IdTerapeuta,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tratamientos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreTratamiento = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DuracionDias = table.Column<int>(type: "int", nullable: false),
                    FechaInicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaFin = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IdPaciente = table.Column<int>(type: "int", nullable: false),
                    PacienteId = table.Column<int>(type: "int", nullable: false),
                    IdTerapeuta = table.Column<int>(type: "int", nullable: false),
                    TerapeutaId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tratamientos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tratamientos_Persona_IdTerapeuta",
                        column: x => x.IdTerapeuta,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Tratamientos_Persona_PacienteId",
                        column: x => x.PacienteId,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Tratamientos_Persona_TerapeutaId",
                        column: x => x.TerapeutaId,
                        principalTable: "Persona",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Citas",
                columns: table => new
                {
                    IdCita = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DuracionProgramadaMin = table.Column<int>(type: "int", nullable: false),
                    HoraInicioReal = table.Column<DateTime>(type: "datetime2", nullable: true),
                    HoraFinReal = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CheckIn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CheckOut = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Confirmada = table.Column<bool>(type: "bit", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdPaciente = table.Column<int>(type: "int", nullable: false),
                    PacienteId = table.Column<int>(type: "int", nullable: false),
                    IdTerapeuta = table.Column<int>(type: "int", nullable: false),
                    IdTratamiento = table.Column<int>(type: "int", nullable: true),
                    TerapeutaId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Citas", x => x.IdCita);
                    table.ForeignKey(
                        name: "FK_Citas_Persona_IdTerapeuta",
                        column: x => x.IdTerapeuta,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Citas_Persona_PacienteId",
                        column: x => x.PacienteId,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Citas_Persona_TerapeutaId",
                        column: x => x.TerapeutaId,
                        principalTable: "Persona",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Citas_Tratamientos_IdTratamiento",
                        column: x => x.IdTratamiento,
                        principalTable: "Tratamientos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PlanTratamientos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Objetivos = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DetallesSesiones = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DuracionDias = table.Column<int>(type: "int", nullable: false),
                    Observaciones = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdPaciente = table.Column<int>(type: "int", nullable: false),
                    PacienteId = table.Column<int>(type: "int", nullable: false),
                    IdTerapeuta = table.Column<int>(type: "int", nullable: false),
                    IdTratamiento = table.Column<int>(type: "int", nullable: false),
                    TerapeutaId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlanTratamientos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlanTratamientos_Persona_IdTerapeuta",
                        column: x => x.IdTerapeuta,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PlanTratamientos_Persona_PacienteId",
                        column: x => x.PacienteId,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlanTratamientos_Persona_TerapeutaId",
                        column: x => x.TerapeutaId,
                        principalTable: "Persona",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PlanTratamientos_Tratamientos_IdTratamiento",
                        column: x => x.IdTratamiento,
                        principalTable: "Tratamientos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TratamientoProtocolos",
                columns: table => new
                {
                    IdTratamientoProtocolo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdTratamiento = table.Column<int>(type: "int", nullable: false),
                    IdProtocolo = table.Column<int>(type: "int", nullable: false),
                    FechaAsignacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    OrdenAplicacion = table.Column<int>(type: "int", nullable: false),
                    NotasAplicacion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TratamientoProtocolos", x => x.IdTratamientoProtocolo);
                    table.ForeignKey(
                        name: "FK_TratamientoProtocolos_ProtocoloTratamientos_IdProtocolo",
                        column: x => x.IdProtocolo,
                        principalTable: "ProtocoloTratamientos",
                        principalColumn: "IdProtocolo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TratamientoProtocolos_Tratamientos_IdTratamiento",
                        column: x => x.IdTratamiento,
                        principalTable: "Tratamientos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TratamientoTipoTerapias",
                columns: table => new
                {
                    IdTratamientoTipoTerapia = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdTratamiento = table.Column<int>(type: "int", nullable: false),
                    IdTipoTerapia = table.Column<int>(type: "int", nullable: false),
                    NumeroSesionesAsignadas = table.Column<int>(type: "int", nullable: false),
                    DuracionMinutosPorSesion = table.Column<int>(type: "int", nullable: false),
                    Observaciones = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TratamientoTipoTerapias", x => x.IdTratamientoTipoTerapia);
                    table.ForeignKey(
                        name: "FK_TratamientoTipoTerapias_TipoTerapias_IdTipoTerapia",
                        column: x => x.IdTipoTerapia,
                        principalTable: "TipoTerapias",
                        principalColumn: "IdTipoTerapia",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TratamientoTipoTerapias_Tratamientos_IdTratamiento",
                        column: x => x.IdTratamiento,
                        principalTable: "Tratamientos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AlertasAgenda",
                columns: table => new
                {
                    IdAlerta = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdCita = table.Column<int>(type: "int", nullable: true),
                    IdTerapeuta = table.Column<int>(type: "int", nullable: false),
                    TipoAlerta = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    FechaGenerada = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Resuelta = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlertasAgenda", x => x.IdAlerta);
                    table.ForeignKey(
                        name: "FK_AlertasAgenda_Citas_IdCita",
                        column: x => x.IdCita,
                        principalTable: "Citas",
                        principalColumn: "IdCita");
                    table.ForeignKey(
                        name: "FK_AlertasAgenda_Persona_IdTerapeuta",
                        column: x => x.IdTerapeuta,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NotasSesion",
                columns: table => new
                {
                    IdNota = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdCita = table.Column<int>(type: "int", nullable: false),
                    IdPaciente = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notas = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Diagnostico = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Recomendaciones = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    CambioDiagnostico = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    RegistradoPor = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    PacienteId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotasSesion", x => x.IdNota);
                    table.ForeignKey(
                        name: "FK_NotasSesion_Citas_IdCita",
                        column: x => x.IdCita,
                        principalTable: "Citas",
                        principalColumn: "IdCita",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NotasSesion_Persona_IdPaciente",
                        column: x => x.IdPaciente,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NotasSesion_Persona_PacienteId",
                        column: x => x.PacienteId,
                        principalTable: "Persona",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ReservasCita",
                columns: table => new
                {
                    IdReserva = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdCita = table.Column<int>(type: "int", nullable: false),
                    TokenConfirmacion = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    FechaSolicitud = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Confirmada = table.Column<bool>(type: "bit", nullable: false),
                    FechaConfirmacion = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MetodoConfirmacion = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservasCita", x => x.IdReserva);
                    table.ForeignKey(
                        name: "FK_ReservasCita_Citas_IdCita",
                        column: x => x.IdCita,
                        principalTable: "Citas",
                        principalColumn: "IdCita",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AlertasAgenda_IdCita",
                table: "AlertasAgenda",
                column: "IdCita");

            migrationBuilder.CreateIndex(
                name: "IX_AlertasAgenda_IdTerapeuta_Resuelta",
                table: "AlertasAgenda",
                columns: new[] { "IdTerapeuta", "Resuelta" });

            migrationBuilder.CreateIndex(
                name: "IX_Citas_IdTerapeuta_CheckIn",
                table: "Citas",
                columns: new[] { "IdTerapeuta", "CheckIn" });

            migrationBuilder.CreateIndex(
                name: "IX_Citas_IdTratamiento",
                table: "Citas",
                column: "IdTratamiento");

            migrationBuilder.CreateIndex(
                name: "IX_Citas_PacienteId",
                table: "Citas",
                column: "PacienteId");

            migrationBuilder.CreateIndex(
                name: "IX_Citas_TerapeutaId",
                table: "Citas",
                column: "TerapeutaId");

            migrationBuilder.CreateIndex(
                name: "IX_ContactosEmergencia_IdPaciente",
                table: "ContactosEmergencia",
                column: "IdPaciente");

            migrationBuilder.CreateIndex(
                name: "IX_DisponibilidadesTerapeutas_IdTerapeuta_DiaSemana",
                table: "DisponibilidadesTerapeutas",
                columns: new[] { "IdTerapeuta", "DiaSemana" });

            migrationBuilder.CreateIndex(
                name: "IX_DocumentosPaciente_IdPaciente_FechaSubida",
                table: "DocumentosPaciente",
                columns: new[] { "IdPaciente", "FechaSubida" });

            migrationBuilder.CreateIndex(
                name: "IX_EquiposSesion_IdEquipo",
                table: "EquiposSesion",
                column: "IdEquipo");

            migrationBuilder.CreateIndex(
                name: "IX_EquiposSesion_IdProtocolo_IdEquipo",
                table: "EquiposSesion",
                columns: new[] { "IdProtocolo", "IdEquipo" },
                unique: true,
                filter: "[IdProtocolo] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_EvolucionesPaciente_IdPaciente_Fecha",
                table: "EvolucionesPaciente",
                columns: new[] { "IdPaciente", "Fecha" });

            migrationBuilder.CreateIndex(
                name: "IX_NotasSesion_IdCita",
                table: "NotasSesion",
                column: "IdCita",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NotasSesion_IdPaciente",
                table: "NotasSesion",
                column: "IdPaciente");

            migrationBuilder.CreateIndex(
                name: "IX_NotasSesion_PacienteId",
                table: "NotasSesion",
                column: "PacienteId");

            migrationBuilder.CreateIndex(
                name: "IX_Persona_DocumentoIdentidad",
                table: "Persona",
                column: "DocumentoIdentidad",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Persona_SeguroMedicoIdSeguro",
                table: "Persona",
                column: "SeguroMedicoIdSeguro");

            migrationBuilder.CreateIndex(
                name: "IX_PlanTratamientos_IdTerapeuta",
                table: "PlanTratamientos",
                column: "IdTerapeuta");

            migrationBuilder.CreateIndex(
                name: "IX_PlanTratamientos_IdTratamiento",
                table: "PlanTratamientos",
                column: "IdTratamiento",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlanTratamientos_PacienteId",
                table: "PlanTratamientos",
                column: "PacienteId");

            migrationBuilder.CreateIndex(
                name: "IX_PlanTratamientos_TerapeutaId",
                table: "PlanTratamientos",
                column: "TerapeutaId");

            migrationBuilder.CreateIndex(
                name: "IX_ProtocoloTipoTerapias_IdProtocolo_IdTipoTerapia",
                table: "ProtocoloTipoTerapias",
                columns: new[] { "IdProtocolo", "IdTipoTerapia" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProtocoloTipoTerapias_IdTipoTerapia",
                table: "ProtocoloTipoTerapias",
                column: "IdTipoTerapia");

            migrationBuilder.CreateIndex(
                name: "IX_ReservasCita_IdCita",
                table: "ReservasCita",
                column: "IdCita",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TerapeutaEspecialidades_IdEspecialidad",
                table: "TerapeutaEspecialidades",
                column: "IdEspecialidad");

            migrationBuilder.CreateIndex(
                name: "IX_TerapeutaEspecialidades_IdTerapeuta_IdEspecialidad",
                table: "TerapeutaEspecialidades",
                columns: new[] { "IdTerapeuta", "IdEspecialidad" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TratamientoProtocolos_IdProtocolo",
                table: "TratamientoProtocolos",
                column: "IdProtocolo");

            migrationBuilder.CreateIndex(
                name: "IX_TratamientoProtocolos_IdTratamiento_IdProtocolo",
                table: "TratamientoProtocolos",
                columns: new[] { "IdTratamiento", "IdProtocolo" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tratamientos_IdTerapeuta",
                table: "Tratamientos",
                column: "IdTerapeuta");

            migrationBuilder.CreateIndex(
                name: "IX_Tratamientos_PacienteId",
                table: "Tratamientos",
                column: "PacienteId");

            migrationBuilder.CreateIndex(
                name: "IX_Tratamientos_TerapeutaId",
                table: "Tratamientos",
                column: "TerapeutaId");

            migrationBuilder.CreateIndex(
                name: "IX_TratamientoTipoTerapias_IdTipoTerapia",
                table: "TratamientoTipoTerapias",
                column: "IdTipoTerapia");

            migrationBuilder.CreateIndex(
                name: "IX_TratamientoTipoTerapias_IdTratamiento_IdTipoTerapia",
                table: "TratamientoTipoTerapias",
                columns: new[] { "IdTratamiento", "IdTipoTerapia" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlertasAgenda");

            migrationBuilder.DropTable(
                name: "ContactosEmergencia");

            migrationBuilder.DropTable(
                name: "DisponibilidadesTerapeutas");

            migrationBuilder.DropTable(
                name: "DocumentosPaciente");

            migrationBuilder.DropTable(
                name: "EquiposSesion");

            migrationBuilder.DropTable(
                name: "EvolucionesPaciente");

            migrationBuilder.DropTable(
                name: "NotasSesion");

            migrationBuilder.DropTable(
                name: "PlanTratamientos");

            migrationBuilder.DropTable(
                name: "ProtocoloTipoTerapias");

            migrationBuilder.DropTable(
                name: "ReservasCita");

            migrationBuilder.DropTable(
                name: "TerapeutaEspecialidades");

            migrationBuilder.DropTable(
                name: "TratamientoProtocolos");

            migrationBuilder.DropTable(
                name: "TratamientoTipoTerapias");

            migrationBuilder.DropTable(
                name: "Equipos");

            migrationBuilder.DropTable(
                name: "Citas");

            migrationBuilder.DropTable(
                name: "Especialidades");

            migrationBuilder.DropTable(
                name: "ProtocoloTratamientos");

            migrationBuilder.DropTable(
                name: "TipoTerapias");

            migrationBuilder.DropTable(
                name: "Tratamientos");

            migrationBuilder.DropTable(
                name: "Persona");

            migrationBuilder.DropTable(
                name: "SegurosMedicos");
        }
    }
}
