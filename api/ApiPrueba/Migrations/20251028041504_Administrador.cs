using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class Administrador : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Administradores_Persona_TerapeutaId",
                table: "Administradores");

            migrationBuilder.DropIndex(
                name: "IX_Administradores_TerapeutaId",
                table: "Administradores");

            migrationBuilder.DropColumn(
                name: "IdTerapeuta",
                table: "Administradores");

            migrationBuilder.DropColumn(
                name: "TerapeutaId",
                table: "Administradores");

            migrationBuilder.RenameColumn(
                name: "NombreAdministrador",
                table: "Administradores",
                newName: "NombreUsuario");

            migrationBuilder.AddColumn<string>(
                name: "CorreoElectronico",
                table: "Administradores",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CorreoElectronico",
                table: "Administradores");

            migrationBuilder.RenameColumn(
                name: "NombreUsuario",
                table: "Administradores",
                newName: "NombreAdministrador");

            migrationBuilder.AddColumn<int>(
                name: "IdTerapeuta",
                table: "Administradores",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TerapeutaId",
                table: "Administradores",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Administradores_TerapeutaId",
                table: "Administradores",
                column: "TerapeutaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Administradores_Persona_TerapeutaId",
                table: "Administradores",
                column: "TerapeutaId",
                principalTable: "Persona",
                principalColumn: "Id");
        }
    }
}
