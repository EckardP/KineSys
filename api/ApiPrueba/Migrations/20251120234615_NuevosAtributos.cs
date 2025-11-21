using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class NuevosAtributos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Celular",
                table: "Persona",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Ciudad",
                table: "Persona",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Departamento",
                table: "Persona",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EPS",
                table: "Persona",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MyProperty",
                table: "Persona",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NumeroDeAfiliacion",
                table: "Persona",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Celular",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "Ciudad",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "Departamento",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "EPS",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "MyProperty",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "NumeroDeAfiliacion",
                table: "Persona");
        }
    }
}
