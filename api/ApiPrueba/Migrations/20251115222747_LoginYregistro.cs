using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class LoginYregistro : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "Persona",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "RolPaciente",
                table: "Persona",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RolTerapeuta",
                table: "Persona",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TipoDocumento",
                table: "Persona",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "User",
                table: "Persona",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Password",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "RolPaciente",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "RolTerapeuta",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "TipoDocumento",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "User",
                table: "Persona");
        }
    }
}
