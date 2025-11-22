using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class contratoSeguro : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cobertura",
                table: "SegurosMedicos");

            migrationBuilder.DropColumn(
                name: "NumeroPoliza",
                table: "SegurosMedicos");

            migrationBuilder.CreateTable(
                name: "ContratosSeguro",
                columns: table => new
                {
                    ContratoId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NumeroPoliza = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Cobertura = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    IdSeguroMedico = table.Column<int>(type: "int", nullable: false),
                    IdPaciente = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContratosSeguro", x => x.ContratoId);
                    table.ForeignKey(
                        name: "FK_ContratosSeguro_Persona_IdPaciente",
                        column: x => x.IdPaciente,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContratosSeguro_SegurosMedicos_IdSeguroMedico",
                        column: x => x.IdSeguroMedico,
                        principalTable: "SegurosMedicos",
                        principalColumn: "IdSeguro",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContratosSeguro_IdPaciente",
                table: "ContratosSeguro",
                column: "IdPaciente");

            migrationBuilder.CreateIndex(
                name: "IX_ContratosSeguro_IdSeguroMedico",
                table: "ContratosSeguro",
                column: "IdSeguroMedico");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContratosSeguro");

            migrationBuilder.AddColumn<string>(
                name: "Cobertura",
                table: "SegurosMedicos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NumeroPoliza",
                table: "SegurosMedicos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
