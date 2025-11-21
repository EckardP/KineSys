using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class Afiliacion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MyProperty",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "NumeroDeAfiliacion",
                table: "Epss");

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
                name: "NumeroDeAfiliacion",
                table: "Persona");

            migrationBuilder.AddColumn<int>(
                name: "MyProperty",
                table: "Persona",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NumeroDeAfiliacion",
                table: "Epss",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
