using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class CorrecionColumnas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Citas_Persona_PacienteId",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanTratamientos_Persona_IdPaciente",
                table: "PlanTratamientos");

            migrationBuilder.DropIndex(
                name: "IX_ReservasCita_IdCita",
                table: "ReservasCita");

            migrationBuilder.DropIndex(
                name: "IX_PlanTratamientos_IdTratamiento",
                table: "PlanTratamientos");

            migrationBuilder.DropIndex(
                name: "IX_NotasSesion_IdCita",
                table: "NotasSesion");

            migrationBuilder.AddColumn<int>(
                name: "PlanTratamientoId",
                table: "Tratamientos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PacienteId",
                table: "PlanTratamientos",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "PacienteId",
                table: "Citas",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Tratamientos_PlanTratamientoId",
                table: "Tratamientos",
                column: "PlanTratamientoId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservasCita_IdCita",
                table: "ReservasCita",
                column: "IdCita");

            migrationBuilder.CreateIndex(
                name: "IX_PlanTratamientos_IdTratamiento",
                table: "PlanTratamientos",
                column: "IdTratamiento");

            migrationBuilder.CreateIndex(
                name: "IX_PlanTratamientos_PacienteId",
                table: "PlanTratamientos",
                column: "PacienteId");

            migrationBuilder.CreateIndex(
                name: "IX_NotasSesion_IdCita",
                table: "NotasSesion",
                column: "IdCita");

            migrationBuilder.CreateIndex(
                name: "IX_Citas_IdPaciente",
                table: "Citas",
                column: "IdPaciente");

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_Persona_IdPaciente",
                table: "Citas",
                column: "IdPaciente",
                principalTable: "Persona",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_Persona_PacienteId",
                table: "Citas",
                column: "PacienteId",
                principalTable: "Persona",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PlanTratamientos_Persona_IdPaciente",
                table: "PlanTratamientos",
                column: "IdPaciente",
                principalTable: "Persona",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanTratamientos_Persona_PacienteId",
                table: "PlanTratamientos",
                column: "PacienteId",
                principalTable: "Persona",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tratamientos_PlanTratamientos_PlanTratamientoId",
                table: "Tratamientos",
                column: "PlanTratamientoId",
                principalTable: "PlanTratamientos",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Citas_Persona_IdPaciente",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_Citas_Persona_PacienteId",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanTratamientos_Persona_IdPaciente",
                table: "PlanTratamientos");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanTratamientos_Persona_PacienteId",
                table: "PlanTratamientos");

            migrationBuilder.DropForeignKey(
                name: "FK_Tratamientos_PlanTratamientos_PlanTratamientoId",
                table: "Tratamientos");

            migrationBuilder.DropIndex(
                name: "IX_Tratamientos_PlanTratamientoId",
                table: "Tratamientos");

            migrationBuilder.DropIndex(
                name: "IX_ReservasCita_IdCita",
                table: "ReservasCita");

            migrationBuilder.DropIndex(
                name: "IX_PlanTratamientos_IdTratamiento",
                table: "PlanTratamientos");

            migrationBuilder.DropIndex(
                name: "IX_PlanTratamientos_PacienteId",
                table: "PlanTratamientos");

            migrationBuilder.DropIndex(
                name: "IX_NotasSesion_IdCita",
                table: "NotasSesion");

            migrationBuilder.DropIndex(
                name: "IX_Citas_IdPaciente",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "PlanTratamientoId",
                table: "Tratamientos");

            migrationBuilder.DropColumn(
                name: "PacienteId",
                table: "PlanTratamientos");

            migrationBuilder.AlterColumn<int>(
                name: "PacienteId",
                table: "Citas",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ReservasCita_IdCita",
                table: "ReservasCita",
                column: "IdCita",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlanTratamientos_IdTratamiento",
                table: "PlanTratamientos",
                column: "IdTratamiento",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NotasSesion_IdCita",
                table: "NotasSesion",
                column: "IdCita",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_Persona_PacienteId",
                table: "Citas",
                column: "PacienteId",
                principalTable: "Persona",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanTratamientos_Persona_IdPaciente",
                table: "PlanTratamientos",
                column: "IdPaciente",
                principalTable: "Persona",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
