using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class Nuevaclase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Administrador_Persona_IdPersona",
                table: "Administrador");

            migrationBuilder.DropForeignKey(
                name: "FK_Administrador_Persona_TerapeutaId",
                table: "Administrador");

            migrationBuilder.DropForeignKey(
                name: "FK_Diagnostico_Persona_IdPaciente",
                table: "Diagnostico");

            migrationBuilder.DropForeignKey(
                name: "FK_Diagnostico_Persona_IdTerapeuta",
                table: "Diagnostico");

            migrationBuilder.DropForeignKey(
                name: "FK_Diagnostico_Persona_PacienteId",
                table: "Diagnostico");

            migrationBuilder.DropForeignKey(
                name: "FK_Diagnostico_Persona_TerapeutaId",
                table: "Diagnostico");

            migrationBuilder.DropForeignKey(
                name: "FK_Diagnostico_Tratamientos_IdTratamiento",
                table: "Diagnostico");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Diagnostico",
                table: "Diagnostico");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Administrador",
                table: "Administrador");

            migrationBuilder.RenameTable(
                name: "Diagnostico",
                newName: "Diagnosticos");

            migrationBuilder.RenameTable(
                name: "Administrador",
                newName: "Administradores");

            migrationBuilder.RenameIndex(
                name: "IX_Diagnostico_TerapeutaId",
                table: "Diagnosticos",
                newName: "IX_Diagnosticos_TerapeutaId");

            migrationBuilder.RenameIndex(
                name: "IX_Diagnostico_PacienteId",
                table: "Diagnosticos",
                newName: "IX_Diagnosticos_PacienteId");

            migrationBuilder.RenameIndex(
                name: "IX_Diagnostico_IdTratamiento",
                table: "Diagnosticos",
                newName: "IX_Diagnosticos_IdTratamiento");

            migrationBuilder.RenameIndex(
                name: "IX_Diagnostico_IdTerapeuta",
                table: "Diagnosticos",
                newName: "IX_Diagnosticos_IdTerapeuta");

            migrationBuilder.RenameIndex(
                name: "IX_Diagnostico_IdPaciente",
                table: "Diagnosticos",
                newName: "IX_Diagnosticos_IdPaciente");

            migrationBuilder.RenameIndex(
                name: "IX_Administrador_TerapeutaId",
                table: "Administradores",
                newName: "IX_Administradores_TerapeutaId");

            migrationBuilder.RenameIndex(
                name: "IX_Administrador_IdPersona",
                table: "Administradores",
                newName: "IX_Administradores_IdPersona");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Diagnosticos",
                table: "Diagnosticos",
                column: "IdDiagnostico");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Administradores",
                table: "Administradores",
                column: "IdAdministrador");

            migrationBuilder.CreateTable(
                name: "HistorialMedicos",
                columns: table => new
                {
                    IdHistorial = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdPaciente = table.Column<int>(type: "int", nullable: false),
                    Alergias = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EnfermedadesCronicas = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CirugiasAnteriores = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MedicamentosActuales = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AntecedentesHeredofamiliares = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Habitos = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ObservacionesGenerales = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaActualizacion = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PacienteId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistorialMedicos", x => x.IdHistorial);
                    table.ForeignKey(
                        name: "FK_HistorialMedicos_Persona_PacienteId",
                        column: x => x.PacienteId,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HistorialMedicos_PacienteId",
                table: "HistorialMedicos",
                column: "PacienteId");

            migrationBuilder.AddForeignKey(
                name: "FK_Administradores_Persona_IdPersona",
                table: "Administradores",
                column: "IdPersona",
                principalTable: "Persona",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Administradores_Persona_TerapeutaId",
                table: "Administradores",
                column: "TerapeutaId",
                principalTable: "Persona",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Diagnosticos_Persona_IdPaciente",
                table: "Diagnosticos",
                column: "IdPaciente",
                principalTable: "Persona",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Diagnosticos_Persona_IdTerapeuta",
                table: "Diagnosticos",
                column: "IdTerapeuta",
                principalTable: "Persona",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Diagnosticos_Persona_PacienteId",
                table: "Diagnosticos",
                column: "PacienteId",
                principalTable: "Persona",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Diagnosticos_Persona_TerapeutaId",
                table: "Diagnosticos",
                column: "TerapeutaId",
                principalTable: "Persona",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Diagnosticos_Tratamientos_IdTratamiento",
                table: "Diagnosticos",
                column: "IdTratamiento",
                principalTable: "Tratamientos",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Administradores_Persona_IdPersona",
                table: "Administradores");

            migrationBuilder.DropForeignKey(
                name: "FK_Administradores_Persona_TerapeutaId",
                table: "Administradores");

            migrationBuilder.DropForeignKey(
                name: "FK_Diagnosticos_Persona_IdPaciente",
                table: "Diagnosticos");

            migrationBuilder.DropForeignKey(
                name: "FK_Diagnosticos_Persona_IdTerapeuta",
                table: "Diagnosticos");

            migrationBuilder.DropForeignKey(
                name: "FK_Diagnosticos_Persona_PacienteId",
                table: "Diagnosticos");

            migrationBuilder.DropForeignKey(
                name: "FK_Diagnosticos_Persona_TerapeutaId",
                table: "Diagnosticos");

            migrationBuilder.DropForeignKey(
                name: "FK_Diagnosticos_Tratamientos_IdTratamiento",
                table: "Diagnosticos");

            migrationBuilder.DropTable(
                name: "HistorialMedicos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Diagnosticos",
                table: "Diagnosticos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Administradores",
                table: "Administradores");

            migrationBuilder.RenameTable(
                name: "Diagnosticos",
                newName: "Diagnostico");

            migrationBuilder.RenameTable(
                name: "Administradores",
                newName: "Administrador");

            migrationBuilder.RenameIndex(
                name: "IX_Diagnosticos_TerapeutaId",
                table: "Diagnostico",
                newName: "IX_Diagnostico_TerapeutaId");

            migrationBuilder.RenameIndex(
                name: "IX_Diagnosticos_PacienteId",
                table: "Diagnostico",
                newName: "IX_Diagnostico_PacienteId");

            migrationBuilder.RenameIndex(
                name: "IX_Diagnosticos_IdTratamiento",
                table: "Diagnostico",
                newName: "IX_Diagnostico_IdTratamiento");

            migrationBuilder.RenameIndex(
                name: "IX_Diagnosticos_IdTerapeuta",
                table: "Diagnostico",
                newName: "IX_Diagnostico_IdTerapeuta");

            migrationBuilder.RenameIndex(
                name: "IX_Diagnosticos_IdPaciente",
                table: "Diagnostico",
                newName: "IX_Diagnostico_IdPaciente");

            migrationBuilder.RenameIndex(
                name: "IX_Administradores_TerapeutaId",
                table: "Administrador",
                newName: "IX_Administrador_TerapeutaId");

            migrationBuilder.RenameIndex(
                name: "IX_Administradores_IdPersona",
                table: "Administrador",
                newName: "IX_Administrador_IdPersona");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Diagnostico",
                table: "Diagnostico",
                column: "IdDiagnostico");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Administrador",
                table: "Administrador",
                column: "IdAdministrador");

            migrationBuilder.AddForeignKey(
                name: "FK_Administrador_Persona_IdPersona",
                table: "Administrador",
                column: "IdPersona",
                principalTable: "Persona",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Administrador_Persona_TerapeutaId",
                table: "Administrador",
                column: "TerapeutaId",
                principalTable: "Persona",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Diagnostico_Persona_IdPaciente",
                table: "Diagnostico",
                column: "IdPaciente",
                principalTable: "Persona",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Diagnostico_Persona_IdTerapeuta",
                table: "Diagnostico",
                column: "IdTerapeuta",
                principalTable: "Persona",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Diagnostico_Persona_PacienteId",
                table: "Diagnostico",
                column: "PacienteId",
                principalTable: "Persona",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Diagnostico_Persona_TerapeutaId",
                table: "Diagnostico",
                column: "TerapeutaId",
                principalTable: "Persona",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Diagnostico_Tratamientos_IdTratamiento",
                table: "Diagnostico",
                column: "IdTratamiento",
                principalTable: "Tratamientos",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
