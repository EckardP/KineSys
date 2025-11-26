using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class ColocaleNombre : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tratamientos_Persona_PacienteId",
                table: "Tratamientos");

            migrationBuilder.DropIndex(
                name: "IX_Tratamientos_PacienteId",
                table: "Tratamientos");

            migrationBuilder.DropColumn(
                name: "PacienteId",
                table: "Tratamientos");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tratamientos_Persona_IdPaciente",
                table: "Tratamientos");

            migrationBuilder.DropIndex(
                name: "IX_Tratamientos_IdPaciente",
                table: "Tratamientos");

            migrationBuilder.AddColumn<int>(
                name: "PacienteId",
                table: "Tratamientos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tratamientos_PacienteId",
                table: "Tratamientos",
                column: "PacienteId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tratamientos_Persona_PacienteId",
                table: "Tratamientos",
                column: "PacienteId",
                principalTable: "Persona",
                principalColumn: "Id");
        }
    }
}
