using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class RelacionCitaHorario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdCita",
                table: "DisponibilidadesTerapeutas",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DisponibilidadesTerapeutas_IdCita",
                table: "DisponibilidadesTerapeutas",
                column: "IdCita");

            migrationBuilder.AddForeignKey(
                name: "FK_DisponibilidadesTerapeutas_Citas_IdCita",
                table: "DisponibilidadesTerapeutas",
                column: "IdCita",
                principalTable: "Citas",
                principalColumn: "IdCita");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DisponibilidadesTerapeutas_Citas_IdCita",
                table: "DisponibilidadesTerapeutas");

            migrationBuilder.DropIndex(
                name: "IX_DisponibilidadesTerapeutas_IdCita",
                table: "DisponibilidadesTerapeutas");

            migrationBuilder.DropColumn(
                name: "IdCita",
                table: "DisponibilidadesTerapeutas");
        }
    }
}
