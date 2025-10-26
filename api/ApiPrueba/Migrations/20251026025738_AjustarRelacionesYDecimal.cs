using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class AjustarRelacionesYDecimal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Administrador",
                columns: table => new
                {
                    IdAdministrador = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreAdministrador = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Rol = table.Column<int>(type: "int", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UltimoAcceso = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IdPersona = table.Column<int>(type: "int", nullable: true),
                    IdTerapeuta = table.Column<int>(type: "int", nullable: true),
                    TerapeutaId = table.Column<int>(type: "int", nullable: true),
                    RefreshToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RefreshTokenExpiracion = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Administrador", x => x.IdAdministrador);
                    table.ForeignKey(
                        name: "FK_Administrador_Persona_IdPersona",
                        column: x => x.IdPersona,
                        principalTable: "Persona",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Administrador_Persona_TerapeutaId",
                        column: x => x.TerapeutaId,
                        principalTable: "Persona",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Diagnostico",
                columns: table => new
                {
                    IdDiagnostico = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Observaciones = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FechaDiagnostico = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IdPaciente = table.Column<int>(type: "int", nullable: false),
                    IdTerapeuta = table.Column<int>(type: "int", nullable: false),
                    IdTratamiento = table.Column<int>(type: "int", nullable: true),
                    PacienteId = table.Column<int>(type: "int", nullable: true),
                    TerapeutaId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Diagnostico", x => x.IdDiagnostico);
                    table.ForeignKey(
                        name: "FK_Diagnostico_Persona_IdPaciente",
                        column: x => x.IdPaciente,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Diagnostico_Persona_IdTerapeuta",
                        column: x => x.IdTerapeuta,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Diagnostico_Persona_PacienteId",
                        column: x => x.PacienteId,
                        principalTable: "Persona",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Diagnostico_Persona_TerapeutaId",
                        column: x => x.TerapeutaId,
                        principalTable: "Persona",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Diagnostico_Tratamientos_IdTratamiento",
                        column: x => x.IdTratamiento,
                        principalTable: "Tratamientos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Administrador_IdPersona",
                table: "Administrador",
                column: "IdPersona",
                unique: true,
                filter: "[IdPersona] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Administrador_TerapeutaId",
                table: "Administrador",
                column: "TerapeutaId");

            migrationBuilder.CreateIndex(
                name: "IX_Diagnostico_IdPaciente",
                table: "Diagnostico",
                column: "IdPaciente");

            migrationBuilder.CreateIndex(
                name: "IX_Diagnostico_IdTerapeuta",
                table: "Diagnostico",
                column: "IdTerapeuta");

            migrationBuilder.CreateIndex(
                name: "IX_Diagnostico_IdTratamiento",
                table: "Diagnostico",
                column: "IdTratamiento");

            migrationBuilder.CreateIndex(
                name: "IX_Diagnostico_PacienteId",
                table: "Diagnostico",
                column: "PacienteId");

            migrationBuilder.CreateIndex(
                name: "IX_Diagnostico_TerapeutaId",
                table: "Diagnostico",
                column: "TerapeutaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Administrador");

            migrationBuilder.DropTable(
                name: "Diagnostico");
        }
    }
}
