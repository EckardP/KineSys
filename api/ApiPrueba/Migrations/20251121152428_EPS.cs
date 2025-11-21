using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class EPS : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EPS",
                table: "Persona");

            migrationBuilder.RenameColumn(
                name: "NumeroDeAfiliacion",
                table: "Persona",
                newName: "EpsId");

            migrationBuilder.CreateTable(
                name: "Epss",
                columns: table => new
                {
                    EPSId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreEPS = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NumeroDeAfiliacion = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Epss", x => x.EPSId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Persona_EpsId",
                table: "Persona",
                column: "EpsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Persona_Epss_EpsId",
                table: "Persona",
                column: "EpsId",
                principalTable: "Epss",
                principalColumn: "EPSId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Persona_Epss_EpsId",
                table: "Persona");

            migrationBuilder.DropTable(
                name: "Epss");

            migrationBuilder.DropIndex(
                name: "IX_Persona_EpsId",
                table: "Persona");

            migrationBuilder.RenameColumn(
                name: "EpsId",
                table: "Persona",
                newName: "NumeroDeAfiliacion");

            migrationBuilder.AddColumn<string>(
                name: "EPS",
                table: "Persona",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
