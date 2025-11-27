using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class ElimineMaterialesrequeridosdelmodeloTratamiento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaterialesRequeridos",
                table: "Tratamientos");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MaterialesRequeridos",
                table: "Tratamientos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
