using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class EpsAfiliado : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EstadoAfiliacion",
                table: "Persona",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaAfiliacion",
                table: "Persona",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Regimen",
                table: "Persona",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TipoAfiliado",
                table: "Persona",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstadoAfiliacion",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "FechaAfiliacion",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "Regimen",
                table: "Persona");

            migrationBuilder.DropColumn(
                name: "TipoAfiliado",
                table: "Persona");
        }
    }
}
