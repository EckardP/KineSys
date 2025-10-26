using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class CorregirID : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HistorialMedicos_Persona_PacienteId",
                table: "HistorialMedicos");

            migrationBuilder.DropIndex(
                name: "IX_HistorialMedicos_PacienteId",
                table: "HistorialMedicos");

            migrationBuilder.DropColumn(
                name: "Diagnostico",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "HistorialMedico",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "PacienteId",
                table: "HistorialMedicos");

            migrationBuilder.CreateIndex(
                name: "IX_HistorialMedicos_IdPaciente",
                table: "HistorialMedicos",
                column: "IdPaciente",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_HistorialMedicos_Persona_IdPaciente",
                table: "HistorialMedicos",
                column: "IdPaciente",
                principalTable: "Persona",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HistorialMedicos_Persona_IdPaciente",
                table: "HistorialMedicos");

            migrationBuilder.DropIndex(
                name: "IX_HistorialMedicos_IdPaciente",
                table: "HistorialMedicos");

            migrationBuilder.AddColumn<string>(
                name: "Diagnostico",
                table: "Persona",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HistorialMedico",
                table: "Persona",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PacienteId",
                table: "HistorialMedicos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_HistorialMedicos_PacienteId",
                table: "HistorialMedicos",
                column: "PacienteId");

            migrationBuilder.AddForeignKey(
                name: "FK_HistorialMedicos_Persona_PacienteId",
                table: "HistorialMedicos",
                column: "PacienteId",
                principalTable: "Persona",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
