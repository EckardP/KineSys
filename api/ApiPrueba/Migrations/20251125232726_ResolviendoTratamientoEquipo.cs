using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class ResolviendoTratamientoEquipo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tratamientos_Persona_IdPaciente",
                table: "Tratamientos");

            migrationBuilder.DropIndex(
                name: "IX_Tratamientos_IdPaciente",
                table: "Tratamientos");

            migrationBuilder.DropColumn(
                name: "FechaFin",
                table: "Tratamientos");

            migrationBuilder.DropColumn(
                name: "FechaInicio",
                table: "Tratamientos");

            migrationBuilder.DropColumn(
                name: "PrecioTratamiento",
                table: "Tratamientos");

            migrationBuilder.RenameColumn(
                name: "NombreTratamiento",
                table: "Tratamientos",
                newName: "Nombre");

            migrationBuilder.RenameColumn(
                name: "DuracionDias",
                table: "Tratamientos",
                newName: "SesionesRecomendadas");

            migrationBuilder.AddColumn<bool>(
                name: "Activo",
                table: "Tratamientos",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Contraindicaciones",
                table: "Tratamientos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "CostoBase",
                table: "Tratamientos",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "DuracionMinutos",
                table: "Tratamientos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "FrecuenciaRecomendada",
                table: "Tratamientos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "IdEspecialidad",
                table: "Tratamientos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Indicaciones",
                table: "Tratamientos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MaterialesRequeridos",
                table: "Tratamientos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "PacienteId",
                table: "Tratamientos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TratamientoEquipos",
                columns: table => new
                {
                    IdTratamientoEquipo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdTratamiento = table.Column<int>(type: "int", nullable: false),
                    IdEquipo = table.Column<int>(type: "int", nullable: false),
                    CantidadRequerida = table.Column<int>(type: "int", nullable: false),
                    Notas = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TratamientoEquipos", x => x.IdTratamientoEquipo);
                    table.ForeignKey(
                        name: "FK_TratamientoEquipos_Equipos_IdEquipo",
                        column: x => x.IdEquipo,
                        principalTable: "Equipos",
                        principalColumn: "IdEquipo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TratamientoEquipos_Tratamientos_IdTratamiento",
                        column: x => x.IdTratamiento,
                        principalTable: "Tratamientos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tratamientos_IdEspecialidad",
                table: "Tratamientos",
                column: "IdEspecialidad");

            migrationBuilder.CreateIndex(
                name: "IX_Tratamientos_PacienteId",
                table: "Tratamientos",
                column: "PacienteId");

            migrationBuilder.CreateIndex(
                name: "IX_TratamientoEquipos_IdEquipo",
                table: "TratamientoEquipos",
                column: "IdEquipo");

            migrationBuilder.CreateIndex(
                name: "IX_TratamientoEquipos_IdTratamiento",
                table: "TratamientoEquipos",
                column: "IdTratamiento");

            migrationBuilder.AddForeignKey(
                name: "FK_Tratamientos_Especialidades_IdEspecialidad",
                table: "Tratamientos",
                column: "IdEspecialidad",
                principalTable: "Especialidades",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tratamientos_Persona_PacienteId",
                table: "Tratamientos",
                column: "PacienteId",
                principalTable: "Persona",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tratamientos_Especialidades_IdEspecialidad",
                table: "Tratamientos");

            migrationBuilder.DropForeignKey(
                name: "FK_Tratamientos_Persona_PacienteId",
                table: "Tratamientos");

            migrationBuilder.DropTable(
                name: "TratamientoEquipos");

            migrationBuilder.DropIndex(
                name: "IX_Tratamientos_IdEspecialidad",
                table: "Tratamientos");

            migrationBuilder.DropIndex(
                name: "IX_Tratamientos_PacienteId",
                table: "Tratamientos");

            migrationBuilder.DropColumn(
                name: "Activo",
                table: "Tratamientos");

            migrationBuilder.DropColumn(
                name: "Contraindicaciones",
                table: "Tratamientos");

            migrationBuilder.DropColumn(
                name: "CostoBase",
                table: "Tratamientos");

            migrationBuilder.DropColumn(
                name: "DuracionMinutos",
                table: "Tratamientos");

            migrationBuilder.DropColumn(
                name: "FrecuenciaRecomendada",
                table: "Tratamientos");

            migrationBuilder.DropColumn(
                name: "IdEspecialidad",
                table: "Tratamientos");

            migrationBuilder.DropColumn(
                name: "Indicaciones",
                table: "Tratamientos");

            migrationBuilder.DropColumn(
                name: "MaterialesRequeridos",
                table: "Tratamientos");

            migrationBuilder.DropColumn(
                name: "PacienteId",
                table: "Tratamientos");

            migrationBuilder.RenameColumn(
                name: "SesionesRecomendadas",
                table: "Tratamientos",
                newName: "DuracionDias");

            migrationBuilder.RenameColumn(
                name: "Nombre",
                table: "Tratamientos",
                newName: "NombreTratamiento");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaFin",
                table: "Tratamientos",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaInicio",
                table: "Tratamientos",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "PrecioTratamiento",
                table: "Tratamientos",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tratamientos_IdPaciente",
                table: "Tratamientos",
                column: "IdPaciente");

            migrationBuilder.AddForeignKey(
                name: "FK_Tratamientos_Persona_IdPaciente",
                table: "Tratamientos",
                column: "IdPaciente",
                principalTable: "Persona",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
