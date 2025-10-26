using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class SolucionIdDuplicados : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EquiposSesion_ProtocoloTratamientos_IdProtocolo",
                table: "EquiposSesion");

            migrationBuilder.AddColumn<int>(
                name: "IdProtocoloTratamiento",
                table: "EquiposSesion",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_EquiposSesion_IdProtocoloTratamiento",
                table: "EquiposSesion",
                column: "IdProtocoloTratamiento");

            migrationBuilder.AddForeignKey(
                name: "FK_EquiposSesion_ProtocoloTratamientos_IdProtocoloTratamiento",
                table: "EquiposSesion",
                column: "IdProtocoloTratamiento",
                principalTable: "ProtocoloTratamientos",
                principalColumn: "IdProtocolo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EquiposSesion_ProtocoloTratamientos_IdProtocoloTratamiento",
                table: "EquiposSesion");

            migrationBuilder.DropIndex(
                name: "IX_EquiposSesion_IdProtocoloTratamiento",
                table: "EquiposSesion");

            migrationBuilder.DropColumn(
                name: "IdProtocoloTratamiento",
                table: "EquiposSesion");

            migrationBuilder.AddForeignKey(
                name: "FK_EquiposSesion_ProtocoloTratamientos_IdProtocolo",
                table: "EquiposSesion",
                column: "IdProtocolo",
                principalTable: "ProtocoloTratamientos",
                principalColumn: "IdProtocolo");
        }
    }
}
