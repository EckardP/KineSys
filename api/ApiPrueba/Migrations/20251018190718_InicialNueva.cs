using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class InicialNueva : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Citas_Pacientes_IdPaciente",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_Citas_Terapeutas_IdTerapeuta",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_Citas_Tratamientos_IdTratamiento",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_Pacientes_SegurosMedicos_SeguroMedicoId",
                table: "Pacientes");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanesTratamiento_Pacientes_PacienteId",
                table: "PlanesTratamiento");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanesTratamiento_Terapeutas_TerapeutaId",
                table: "PlanesTratamiento");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanesTratamiento_Tratamientos_IdTratamiento",
                table: "PlanesTratamiento");

            migrationBuilder.DropForeignKey(
                name: "FK_Terapeutas_Especialidades_EspecialidadId",
                table: "Terapeutas");

            migrationBuilder.DropForeignKey(
                name: "FK_Tratamientos_Pacientes_IdPaciente",
                table: "Tratamientos");

            migrationBuilder.DropForeignKey(
                name: "FK_Tratamientos_Terapeutas_IdTerapeuta",
                table: "Tratamientos");

            migrationBuilder.DropTable(
                name: "Auditorias");

            migrationBuilder.DropTable(
                name: "Facturas");

            migrationBuilder.DropTable(
                name: "Inventarios");

            migrationBuilder.DropTable(
                name: "MensajesChat");

            migrationBuilder.DropTable(
                name: "Notificaciones");

            migrationBuilder.DropIndex(
                name: "IX_Citas_IdPaciente",
                table: "Citas");

            migrationBuilder.DropIndex(
                name: "IX_Citas_IdTerapeuta",
                table: "Citas");

            migrationBuilder.DropIndex(
                name: "IX_Citas_IdTratamiento",
                table: "Citas");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tratamientos",
                table: "Tratamientos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SegurosMedicos",
                table: "SegurosMedicos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PlanesTratamiento",
                table: "PlanesTratamiento");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Especialidades",
                table: "Especialidades");

            migrationBuilder.DropColumn(
                name: "Estado",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "FechaCita",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "HoraCita",
                table: "Citas");

            migrationBuilder.RenameTable(
                name: "Tratamientos",
                newName: "Tratamiento");

            migrationBuilder.RenameTable(
                name: "SegurosMedicos",
                newName: "SeguroMedico");

            migrationBuilder.RenameTable(
                name: "PlanesTratamiento",
                newName: "PlanTratamiento");

            migrationBuilder.RenameTable(
                name: "Especialidades",
                newName: "Especialidad");

            migrationBuilder.RenameIndex(
                name: "IX_Tratamientos_IdTerapeuta",
                table: "Tratamiento",
                newName: "IX_Tratamiento_IdTerapeuta");

            migrationBuilder.RenameIndex(
                name: "IX_Tratamientos_IdPaciente",
                table: "Tratamiento",
                newName: "IX_Tratamiento_IdPaciente");

            migrationBuilder.RenameIndex(
                name: "IX_PlanesTratamiento_TerapeutaId",
                table: "PlanTratamiento",
                newName: "IX_PlanTratamiento_TerapeutaId");

            migrationBuilder.RenameIndex(
                name: "IX_PlanesTratamiento_PacienteId",
                table: "PlanTratamiento",
                newName: "IX_PlanTratamiento_PacienteId");

            migrationBuilder.RenameIndex(
                name: "IX_PlanesTratamiento_IdTratamiento",
                table: "PlanTratamiento",
                newName: "IX_PlanTratamiento_IdTratamiento");

            migrationBuilder.AddColumn<DateTime>(
                name: "CheckIn",
                table: "Citas",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CheckOut",
                table: "Citas",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Confirmada",
                table: "Citas",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "DuracionProgramadaMin",
                table: "Citas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "HoraFinReal",
                table: "Citas",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "HoraInicioReal",
                table: "Citas",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PacienteId",
                table: "Citas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TerapeutaId",
                table: "Citas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TratamientoId",
                table: "Citas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PacienteId",
                table: "Tratamiento",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TerapeutaId",
                table: "Tratamiento",
                type: "int",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tratamiento",
                table: "Tratamiento",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SeguroMedico",
                table: "SeguroMedico",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlanTratamiento",
                table: "PlanTratamiento",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Especialidad",
                table: "Especialidad",
                column: "Id");

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
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_AlertasAgenda_Terapeutas_IdTerapeuta",
                        column: x => x.IdTerapeuta,
                        principalTable: "Terapeutas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
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
                        name: "FK_ContactosEmergencia_Pacientes_IdPaciente",
                        column: x => x.IdPaciente,
                        principalTable: "Pacientes",
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
                        name: "FK_DisponibilidadesTerapeutas_Terapeutas_IdTerapeuta",
                        column: x => x.IdTerapeuta,
                        principalTable: "Terapeutas",
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
                        name: "FK_DocumentosPaciente_Pacientes_IdPaciente",
                        column: x => x.IdPaciente,
                        principalTable: "Pacientes",
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
                        name: "FK_EvolucionesPaciente_Pacientes_IdPaciente",
                        column: x => x.IdPaciente,
                        principalTable: "Pacientes",
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
                    RegistradoPor = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotasSesion", x => x.IdNota);
                    table.ForeignKey(
                        name: "FK_NotasSesion_Citas_IdCita",
                        column: x => x.IdCita,
                        principalTable: "Citas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NotasSesion_Pacientes_IdPaciente",
                        column: x => x.IdPaciente,
                        principalTable: "Pacientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProtocolosTratamiento",
                columns: table => new
                {
                    IdProtocolo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    NumeroSesiones = table.Column<int>(type: "int", nullable: false),
                    DuracionPorSesionMin = table.Column<int>(type: "int", nullable: false),
                    Recomendaciones = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProtocolosTratamiento", x => x.IdProtocolo);
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
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
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
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EquiposSesion_ProtocolosTratamiento_IdProtocolo",
                        column: x => x.IdProtocolo,
                        principalTable: "ProtocolosTratamiento",
                        principalColumn: "IdProtocolo",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Citas_PacienteId",
                table: "Citas",
                column: "PacienteId");

            migrationBuilder.CreateIndex(
                name: "IX_Citas_TerapeutaId",
                table: "Citas",
                column: "TerapeutaId");

            migrationBuilder.CreateIndex(
                name: "IX_Citas_TratamientoId",
                table: "Citas",
                column: "TratamientoId");

            migrationBuilder.CreateIndex(
                name: "IX_Tratamiento_PacienteId",
                table: "Tratamiento",
                column: "PacienteId");

            migrationBuilder.CreateIndex(
                name: "IX_Tratamiento_TerapeutaId",
                table: "Tratamiento",
                column: "TerapeutaId");

            migrationBuilder.CreateIndex(
                name: "IX_AlertasAgenda_IdCita",
                table: "AlertasAgenda",
                column: "IdCita");

            migrationBuilder.CreateIndex(
                name: "IX_AlertasAgenda_IdTerapeuta",
                table: "AlertasAgenda",
                column: "IdTerapeuta");

            migrationBuilder.CreateIndex(
                name: "IX_ContactosEmergencia_IdPaciente",
                table: "ContactosEmergencia",
                column: "IdPaciente");

            migrationBuilder.CreateIndex(
                name: "IX_DisponibilidadesTerapeutas_IdTerapeuta_DiaSemana",
                table: "DisponibilidadesTerapeutas",
                columns: new[] { "IdTerapeuta", "DiaSemana" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DocumentosPaciente_IdPaciente",
                table: "DocumentosPaciente",
                column: "IdPaciente");

            migrationBuilder.CreateIndex(
                name: "IX_EquiposSesion_IdEquipo",
                table: "EquiposSesion",
                column: "IdEquipo");

            migrationBuilder.CreateIndex(
                name: "IX_EquiposSesion_IdProtocolo",
                table: "EquiposSesion",
                column: "IdProtocolo");

            migrationBuilder.CreateIndex(
                name: "IX_EvolucionesPaciente_IdPaciente",
                table: "EvolucionesPaciente",
                column: "IdPaciente");

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
                name: "IX_ReservasCita_IdCita",
                table: "ReservasCita",
                column: "IdCita",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_Pacientes_PacienteId",
                table: "Citas",
                column: "PacienteId",
                principalTable: "Pacientes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_Terapeutas_TerapeutaId",
                table: "Citas",
                column: "TerapeutaId",
                principalTable: "Terapeutas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_Tratamiento_TratamientoId",
                table: "Citas",
                column: "TratamientoId",
                principalTable: "Tratamiento",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Pacientes_SeguroMedico_SeguroMedicoId",
                table: "Pacientes",
                column: "SeguroMedicoId",
                principalTable: "SeguroMedico",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanTratamiento_Pacientes_PacienteId",
                table: "PlanTratamiento",
                column: "PacienteId",
                principalTable: "Pacientes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanTratamiento_Terapeutas_TerapeutaId",
                table: "PlanTratamiento",
                column: "TerapeutaId",
                principalTable: "Terapeutas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanTratamiento_Tratamiento_IdTratamiento",
                table: "PlanTratamiento",
                column: "IdTratamiento",
                principalTable: "Tratamiento",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Terapeutas_Especialidad_EspecialidadId",
                table: "Terapeutas",
                column: "EspecialidadId",
                principalTable: "Especialidad",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tratamiento_Pacientes_IdPaciente",
                table: "Tratamiento",
                column: "IdPaciente",
                principalTable: "Pacientes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tratamiento_Pacientes_PacienteId",
                table: "Tratamiento",
                column: "PacienteId",
                principalTable: "Pacientes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tratamiento_Terapeutas_IdTerapeuta",
                table: "Tratamiento",
                column: "IdTerapeuta",
                principalTable: "Terapeutas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tratamiento_Terapeutas_TerapeutaId",
                table: "Tratamiento",
                column: "TerapeutaId",
                principalTable: "Terapeutas",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Citas_Pacientes_PacienteId",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_Citas_Terapeutas_TerapeutaId",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_Citas_Tratamiento_TratamientoId",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_Pacientes_SeguroMedico_SeguroMedicoId",
                table: "Pacientes");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanTratamiento_Pacientes_PacienteId",
                table: "PlanTratamiento");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanTratamiento_Terapeutas_TerapeutaId",
                table: "PlanTratamiento");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanTratamiento_Tratamiento_IdTratamiento",
                table: "PlanTratamiento");

            migrationBuilder.DropForeignKey(
                name: "FK_Terapeutas_Especialidad_EspecialidadId",
                table: "Terapeutas");

            migrationBuilder.DropForeignKey(
                name: "FK_Tratamiento_Pacientes_IdPaciente",
                table: "Tratamiento");

            migrationBuilder.DropForeignKey(
                name: "FK_Tratamiento_Pacientes_PacienteId",
                table: "Tratamiento");

            migrationBuilder.DropForeignKey(
                name: "FK_Tratamiento_Terapeutas_IdTerapeuta",
                table: "Tratamiento");

            migrationBuilder.DropForeignKey(
                name: "FK_Tratamiento_Terapeutas_TerapeutaId",
                table: "Tratamiento");

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
                name: "ReservasCita");

            migrationBuilder.DropTable(
                name: "ProtocolosTratamiento");

            migrationBuilder.DropIndex(
                name: "IX_Citas_PacienteId",
                table: "Citas");

            migrationBuilder.DropIndex(
                name: "IX_Citas_TerapeutaId",
                table: "Citas");

            migrationBuilder.DropIndex(
                name: "IX_Citas_TratamientoId",
                table: "Citas");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tratamiento",
                table: "Tratamiento");

            migrationBuilder.DropIndex(
                name: "IX_Tratamiento_PacienteId",
                table: "Tratamiento");

            migrationBuilder.DropIndex(
                name: "IX_Tratamiento_TerapeutaId",
                table: "Tratamiento");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SeguroMedico",
                table: "SeguroMedico");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PlanTratamiento",
                table: "PlanTratamiento");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Especialidad",
                table: "Especialidad");

            migrationBuilder.DropColumn(
                name: "CheckIn",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "CheckOut",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "Confirmada",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "DuracionProgramadaMin",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "HoraFinReal",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "HoraInicioReal",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "PacienteId",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "TerapeutaId",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "TratamientoId",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "PacienteId",
                table: "Tratamiento");

            migrationBuilder.DropColumn(
                name: "TerapeutaId",
                table: "Tratamiento");

            migrationBuilder.RenameTable(
                name: "Tratamiento",
                newName: "Tratamientos");

            migrationBuilder.RenameTable(
                name: "SeguroMedico",
                newName: "SegurosMedicos");

            migrationBuilder.RenameTable(
                name: "PlanTratamiento",
                newName: "PlanesTratamiento");

            migrationBuilder.RenameTable(
                name: "Especialidad",
                newName: "Especialidades");

            migrationBuilder.RenameIndex(
                name: "IX_Tratamiento_IdTerapeuta",
                table: "Tratamientos",
                newName: "IX_Tratamientos_IdTerapeuta");

            migrationBuilder.RenameIndex(
                name: "IX_Tratamiento_IdPaciente",
                table: "Tratamientos",
                newName: "IX_Tratamientos_IdPaciente");

            migrationBuilder.RenameIndex(
                name: "IX_PlanTratamiento_TerapeutaId",
                table: "PlanesTratamiento",
                newName: "IX_PlanesTratamiento_TerapeutaId");

            migrationBuilder.RenameIndex(
                name: "IX_PlanTratamiento_PacienteId",
                table: "PlanesTratamiento",
                newName: "IX_PlanesTratamiento_PacienteId");

            migrationBuilder.RenameIndex(
                name: "IX_PlanTratamiento_IdTratamiento",
                table: "PlanesTratamiento",
                newName: "IX_PlanesTratamiento_IdTratamiento");

            migrationBuilder.AddColumn<string>(
                name: "Estado",
                table: "Citas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaCita",
                table: "Citas",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "HoraCita",
                table: "Citas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tratamientos",
                table: "Tratamientos",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SegurosMedicos",
                table: "SegurosMedicos",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlanesTratamiento",
                table: "PlanesTratamiento",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Especialidades",
                table: "Especialidades",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Auditorias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Accion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Detalle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Entidad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaAccion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Usuario = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Auditorias", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Facturas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdSeguroMedico = table.Column<int>(type: "int", nullable: true),
                    PacienteId = table.Column<int>(type: "int", nullable: false),
                    EstadoPago = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaEmision = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IdPaciente = table.Column<int>(type: "int", nullable: false),
                    MetodoPago = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MontoTotal = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    SeguroMedicoId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Facturas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Facturas_Pacientes_PacienteId",
                        column: x => x.PacienteId,
                        principalTable: "Pacientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Facturas_SegurosMedicos_IdSeguroMedico",
                        column: x => x.IdSeguroMedico,
                        principalTable: "SegurosMedicos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Facturas_SegurosMedicos_SeguroMedicoId",
                        column: x => x.SeguroMedicoId,
                        principalTable: "SegurosMedicos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Inventarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdEquipo = table.Column<int>(type: "int", nullable: false),
                    Cantidad = table.Column<int>(type: "int", nullable: false),
                    Ubicacion = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inventarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Inventarios_Equipos_IdEquipo",
                        column: x => x.IdEquipo,
                        principalTable: "Equipos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MensajesChat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Contenido = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaEnvio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IdDestinatario = table.Column<int>(type: "int", nullable: false),
                    IdRemitente = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MensajesChat", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Notificaciones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FechaEnvio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IdPaciente = table.Column<int>(type: "int", nullable: true),
                    IdTerapeuta = table.Column<int>(type: "int", nullable: true),
                    Leida = table.Column<bool>(type: "bit", nullable: false),
                    Mensaje = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Titulo = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notificaciones", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Citas_IdPaciente",
                table: "Citas",
                column: "IdPaciente");

            migrationBuilder.CreateIndex(
                name: "IX_Citas_IdTerapeuta",
                table: "Citas",
                column: "IdTerapeuta");

            migrationBuilder.CreateIndex(
                name: "IX_Citas_IdTratamiento",
                table: "Citas",
                column: "IdTratamiento");

            migrationBuilder.CreateIndex(
                name: "IX_Facturas_IdSeguroMedico",
                table: "Facturas",
                column: "IdSeguroMedico");

            migrationBuilder.CreateIndex(
                name: "IX_Facturas_PacienteId",
                table: "Facturas",
                column: "PacienteId");

            migrationBuilder.CreateIndex(
                name: "IX_Facturas_SeguroMedicoId",
                table: "Facturas",
                column: "SeguroMedicoId");

            migrationBuilder.CreateIndex(
                name: "IX_Inventarios_IdEquipo",
                table: "Inventarios",
                column: "IdEquipo",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_Pacientes_IdPaciente",
                table: "Citas",
                column: "IdPaciente",
                principalTable: "Pacientes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_Terapeutas_IdTerapeuta",
                table: "Citas",
                column: "IdTerapeuta",
                principalTable: "Terapeutas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_Tratamientos_IdTratamiento",
                table: "Citas",
                column: "IdTratamiento",
                principalTable: "Tratamientos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pacientes_SegurosMedicos_SeguroMedicoId",
                table: "Pacientes",
                column: "SeguroMedicoId",
                principalTable: "SegurosMedicos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanesTratamiento_Pacientes_PacienteId",
                table: "PlanesTratamiento",
                column: "PacienteId",
                principalTable: "Pacientes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanesTratamiento_Terapeutas_TerapeutaId",
                table: "PlanesTratamiento",
                column: "TerapeutaId",
                principalTable: "Terapeutas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanesTratamiento_Tratamientos_IdTratamiento",
                table: "PlanesTratamiento",
                column: "IdTratamiento",
                principalTable: "Tratamientos",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Terapeutas_Especialidades_EspecialidadId",
                table: "Terapeutas",
                column: "EspecialidadId",
                principalTable: "Especialidades",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tratamientos_Pacientes_IdPaciente",
                table: "Tratamientos",
                column: "IdPaciente",
                principalTable: "Pacientes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tratamientos_Terapeutas_IdTerapeuta",
                table: "Tratamientos",
                column: "IdTerapeuta",
                principalTable: "Terapeutas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
