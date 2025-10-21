using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class ActualizarTerapeuta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Citas_Tratamiento_TratamientoId",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanTratamiento_Tratamiento_IdTratamiento",
                table: "PlanTratamiento");

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

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tratamiento",
                table: "Tratamiento");

            migrationBuilder.RenameTable(
                name: "Tratamiento",
                newName: "Tratamientos");

            migrationBuilder.RenameIndex(
                name: "IX_Tratamiento_TerapeutaId",
                table: "Tratamientos",
                newName: "IX_Tratamientos_TerapeutaId");

            migrationBuilder.RenameIndex(
                name: "IX_Tratamiento_PacienteId",
                table: "Tratamientos",
                newName: "IX_Tratamientos_PacienteId");

            migrationBuilder.RenameIndex(
                name: "IX_Tratamiento_IdTerapeuta",
                table: "Tratamientos",
                newName: "IX_Tratamientos_IdTerapeuta");

            migrationBuilder.RenameIndex(
                name: "IX_Tratamiento_IdPaciente",
                table: "Tratamientos",
                newName: "IX_Tratamientos_IdPaciente");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Terapeutas",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tratamientos",
                table: "Tratamientos",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_Tratamientos_TratamientoId",
                table: "Citas",
                column: "TratamientoId",
                principalTable: "Tratamientos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanTratamiento_Tratamientos_IdTratamiento",
                table: "PlanTratamiento",
                column: "IdTratamiento",
                principalTable: "Tratamientos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tratamientos_Pacientes_IdPaciente",
                table: "Tratamientos",
                column: "IdPaciente",
                principalTable: "Pacientes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tratamientos_Pacientes_PacienteId",
                table: "Tratamientos",
                column: "PacienteId",
                principalTable: "Pacientes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tratamientos_Terapeutas_IdTerapeuta",
                table: "Tratamientos",
                column: "IdTerapeuta",
                principalTable: "Terapeutas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tratamientos_Terapeutas_TerapeutaId",
                table: "Tratamientos",
                column: "TerapeutaId",
                principalTable: "Terapeutas",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Citas_Tratamientos_TratamientoId",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanTratamiento_Tratamientos_IdTratamiento",
                table: "PlanTratamiento");

            migrationBuilder.DropForeignKey(
                name: "FK_Tratamientos_Pacientes_IdPaciente",
                table: "Tratamientos");

            migrationBuilder.DropForeignKey(
                name: "FK_Tratamientos_Pacientes_PacienteId",
                table: "Tratamientos");

            migrationBuilder.DropForeignKey(
                name: "FK_Tratamientos_Terapeutas_IdTerapeuta",
                table: "Tratamientos");

            migrationBuilder.DropForeignKey(
                name: "FK_Tratamientos_Terapeutas_TerapeutaId",
                table: "Tratamientos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tratamientos",
                table: "Tratamientos");

            migrationBuilder.RenameTable(
                name: "Tratamientos",
                newName: "Tratamiento");

            migrationBuilder.RenameIndex(
                name: "IX_Tratamientos_TerapeutaId",
                table: "Tratamiento",
                newName: "IX_Tratamiento_TerapeutaId");

            migrationBuilder.RenameIndex(
                name: "IX_Tratamientos_PacienteId",
                table: "Tratamiento",
                newName: "IX_Tratamiento_PacienteId");

            migrationBuilder.RenameIndex(
                name: "IX_Tratamientos_IdTerapeuta",
                table: "Tratamiento",
                newName: "IX_Tratamiento_IdTerapeuta");

            migrationBuilder.RenameIndex(
                name: "IX_Tratamientos_IdPaciente",
                table: "Tratamiento",
                newName: "IX_Tratamiento_IdPaciente");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Terapeutas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tratamiento",
                table: "Tratamiento",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_Tratamiento_TratamientoId",
                table: "Citas",
                column: "TratamientoId",
                principalTable: "Tratamiento",
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
    }
}
