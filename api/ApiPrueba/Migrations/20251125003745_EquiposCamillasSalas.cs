using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class EquiposCamillasSalas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EstadoDelProcesoActual",
                table: "Persona",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NumeroSesionesAplicadas",
                table: "Persona",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UltimaValoracion",
                table: "Persona",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Copago",
                table: "Citas",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IdAutorizacion",
                table: "Citas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IdEPS",
                table: "Citas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IdOrdenMedica",
                table: "Citas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IdSala",
                table: "Citas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IdTipoServicio",
                table: "Citas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OrdenMedicaIdOrdenMedica",
                table: "Citas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SalaIdSala",
                table: "Citas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TipoAtencion",
                table: "Citas",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "OrdenMedica",
                columns: table => new
                {
                    IdOrdenMedica = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdPaciente = table.Column<int>(type: "int", nullable: false),
                    IdTipoDocumento = table.Column<int>(type: "int", nullable: true),
                    NumeroOrden = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FechaEmision = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaVencimiento = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MedicoEmite = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Especialidad = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Diagnostico = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    TratamientoOrdenado = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    NumeroSesionesAutorizadas = table.Column<int>(type: "int", nullable: true),
                    SesionesConsumidas = table.Column<int>(type: "int", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    RutaSoporte = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    Observaciones = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    TipoDocumento = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrdenMedica", x => x.IdOrdenMedica);
                    table.ForeignKey(
                        name: "FK_OrdenMedica_Persona_IdPaciente",
                        column: x => x.IdPaciente,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Sala",
                columns: table => new
                {
                    IdSala = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Tipo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Capacidad = table.Column<int>(type: "int", nullable: true),
                    Ubicacion = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Descripcion = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sala", x => x.IdSala);
                });

            migrationBuilder.CreateTable(
                name: "TipoServicio",
                columns: table => new
                {
                    IdTipoServicio = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreServicio = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DuracionEstandarMin = table.Column<int>(type: "int", nullable: false),
                    TipoSalaNecesaria = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Precio = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CompatibleConEPS = table.Column<bool>(type: "bit", nullable: false),
                    CompatibleConPrepagadas = table.Column<bool>(type: "bit", nullable: false),
                    DocumentosNecesarios = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoServicio", x => x.IdTipoServicio);
                });

            migrationBuilder.CreateTable(
                name: "AutorizacionSesiones",
                columns: table => new
                {
                    IdAutorizacion = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdPaciente = table.Column<int>(type: "int", nullable: false),
                    IdOrdenMedica = table.Column<int>(type: "int", nullable: true),
                    NumeroAutorizacion = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FechaAutorizacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaVigenciaInicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaVigenciaFin = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SesionesAprobadas = table.Column<int>(type: "int", nullable: false),
                    SesionesConsumidas = table.Column<int>(type: "int", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    RutaSoporte = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    Observaciones = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AutorizacionSesiones", x => x.IdAutorizacion);
                    table.ForeignKey(
                        name: "FK_AutorizacionSesiones_OrdenMedica_IdOrdenMedica",
                        column: x => x.IdOrdenMedica,
                        principalTable: "OrdenMedica",
                        principalColumn: "IdOrdenMedica");
                    table.ForeignKey(
                        name: "FK_AutorizacionSesiones_Persona_IdPaciente",
                        column: x => x.IdPaciente,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EquiposRequeridos",
                columns: table => new
                {
                    IdEquipoRequerido = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdTipoServicio = table.Column<int>(type: "int", nullable: false),
                    IdEquipo = table.Column<int>(type: "int", nullable: false),
                    CantidadRequerida = table.Column<int>(type: "int", nullable: false),
                    EsObligatorio = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquiposRequeridos", x => x.IdEquipoRequerido);
                    table.ForeignKey(
                        name: "FK_EquiposRequeridos_Equipos_IdEquipo",
                        column: x => x.IdEquipo,
                        principalTable: "Equipos",
                        principalColumn: "IdEquipo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EquiposRequeridos_TipoServicio_IdTipoServicio",
                        column: x => x.IdTipoServicio,
                        principalTable: "TipoServicio",
                        principalColumn: "IdTipoServicio",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TipoServicioEspecialidad",
                columns: table => new
                {
                    IdTipoServicioEspecialidad = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdTipoServicio = table.Column<int>(type: "int", nullable: false),
                    IdEspecialidad = table.Column<int>(type: "int", nullable: false),
                    EsObligatoria = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoServicioEspecialidad", x => x.IdTipoServicioEspecialidad);
                    table.ForeignKey(
                        name: "FK_TipoServicioEspecialidad_Especialidades_IdEspecialidad",
                        column: x => x.IdEspecialidad,
                        principalTable: "Especialidades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TipoServicioEspecialidad_TipoServicio_IdTipoServicio",
                        column: x => x.IdTipoServicio,
                        principalTable: "TipoServicio",
                        principalColumn: "IdTipoServicio",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Citas_OrdenMedicaIdOrdenMedica",
                table: "Citas",
                column: "OrdenMedicaIdOrdenMedica");

            migrationBuilder.CreateIndex(
                name: "IX_Citas_SalaIdSala",
                table: "Citas",
                column: "SalaIdSala");

            migrationBuilder.CreateIndex(
                name: "IX_AutorizacionSesiones_IdOrdenMedica",
                table: "AutorizacionSesiones",
                column: "IdOrdenMedica");

            migrationBuilder.CreateIndex(
                name: "IX_AutorizacionSesiones_IdPaciente",
                table: "AutorizacionSesiones",
                column: "IdPaciente");

            migrationBuilder.CreateIndex(
                name: "IX_EquiposRequeridos_IdEquipo",
                table: "EquiposRequeridos",
                column: "IdEquipo");

            migrationBuilder.CreateIndex(
                name: "IX_EquiposRequeridos_IdTipoServicio",
                table: "EquiposRequeridos",
                column: "IdTipoServicio");

            migrationBuilder.CreateIndex(
                name: "IX_OrdenMedica_IdPaciente",
                table: "OrdenMedica",
                column: "IdPaciente");

            migrationBuilder.CreateIndex(
                name: "IX_TipoServicioEspecialidad_IdEspecialidad",
                table: "TipoServicioEspecialidad",
                column: "IdEspecialidad");

            migrationBuilder.CreateIndex(
                name: "IX_TipoServicioEspecialidad_IdTipoServicio",
                table: "TipoServicioEspecialidad",
                column: "IdTipoServicio");

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_OrdenMedica_OrdenMedicaIdOrdenMedica",
                table: "Citas",
                column: "OrdenMedicaIdOrdenMedica",
                principalTable: "OrdenMedica",
                principalColumn: "IdOrdenMedica");

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_Sala_SalaIdSala",
                table: "Citas",
                column: "SalaIdSala",
                principalTable: "Sala",
                principalColumn: "IdSala");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Citas_OrdenMedica_OrdenMedicaIdOrdenMedica",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_Citas_Sala_SalaIdSala",
                table: "Citas");

            migrationBuilder.DropTable(
                name: "AutorizacionSesiones");

            migrationBuilder.DropTable(
                name: "EquiposRequeridos");

            migrationBuilder.DropTable(
                name: "Sala");

            migrationBuilder.DropTable(
                name: "TipoServicioEspecialidad");

            migrationBuilder.DropTable(
                name: "OrdenMedica");

            migrationBuilder.DropTable(
                name: "TipoServicio");

            migrationBuilder.DropIndex(
                name: "IX_Citas_OrdenMedicaIdOrdenMedica",
                table: "Citas");

            migrationBuilder.DropIndex(
                name: "IX_Citas_SalaIdSala",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "EstadoDelProcesoActual",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "NumeroSesionesAplicadas",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "UltimaValoracion",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "Copago",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "IdAutorizacion",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "IdEPS",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "IdOrdenMedica",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "IdSala",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "IdTipoServicio",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "OrdenMedicaIdOrdenMedica",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "SalaIdSala",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "TipoAtencion",
                table: "Citas");
        }
    }
}
