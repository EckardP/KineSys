using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPrueba.Migrations
{
    /// <inheritdoc />
    public partial class AuditoriayFactura : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubidoPor",
                table: "DocumentosPaciente");

            migrationBuilder.AddColumn<decimal>(
                name: "PrecioTratamiento",
                table: "Tratamientos",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "TipoDocumento",
                table: "DocumentosPaciente",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<string>(
                name: "Descripcion",
                table: "DocumentosPaciente",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IdUsuarioSubida",
                table: "DocumentosPaciente",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "TamañoArchivo",
                table: "DocumentosPaciente",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "Motivo",
                table: "Citas",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PrecioCita",
                table: "Citas",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Auditoria",
                columns: table => new
                {
                    IdAuditoria = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Entidad = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IdEntidad = table.Column<int>(type: "int", nullable: false),
                    Accion = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IdPersona = table.Column<int>(type: "int", nullable: true),
                    NombreUsuario = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    FechaHora = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DireccionIP = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ValoresAnteriores = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ValoresNuevos = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Observaciones = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Exitoso = table.Column<bool>(type: "bit", nullable: false),
                    MensajeError = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Auditoria", x => x.IdAuditoria);
                });

            migrationBuilder.CreateTable(
                name: "Factura",
                columns: table => new
                {
                    IdFactura = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NumeroFactura = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IdPaciente = table.Column<int>(type: "int", nullable: false),
                    IdTratamiento = table.Column<int>(type: "int", nullable: true),
                    FechaEmision = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaVencimiento = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Subtotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Impuesto = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Descuento = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MetodoPago = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    FechaPago = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RutaArchivoPDF = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Observaciones = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IdUsuarioCreador = table.Column<int>(type: "int", nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Factura", x => x.IdFactura);
                    table.ForeignKey(
                        name: "FK_Factura_Persona_IdPaciente",
                        column: x => x.IdPaciente,
                        principalTable: "Persona",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Factura_Tratamientos_IdTratamiento",
                        column: x => x.IdTratamiento,
                        principalTable: "Tratamientos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DetalleFactura",
                columns: table => new
                {
                    IdDetalle = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdFactura = table.Column<int>(type: "int", nullable: false),
                    Concepto = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Cantidad = table.Column<int>(type: "int", nullable: false),
                    PrecioUnitario = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Subtotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetalleFactura", x => x.IdDetalle);
                    table.ForeignKey(
                        name: "FK_DetalleFactura_Factura_IdFactura",
                        column: x => x.IdFactura,
                        principalTable: "Factura",
                        principalColumn: "IdFactura",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DetalleFactura_IdFactura",
                table: "DetalleFactura",
                column: "IdFactura");

            migrationBuilder.CreateIndex(
                name: "IX_Factura_IdPaciente",
                table: "Factura",
                column: "IdPaciente");

            migrationBuilder.CreateIndex(
                name: "IX_Factura_IdTratamiento",
                table: "Factura",
                column: "IdTratamiento");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Auditoria");

            migrationBuilder.DropTable(
                name: "DetalleFactura");

            migrationBuilder.DropTable(
                name: "Factura");

            migrationBuilder.DropColumn(
                name: "PrecioTratamiento",
                table: "Tratamientos");

            migrationBuilder.DropColumn(
                name: "Descripcion",
                table: "DocumentosPaciente");

            migrationBuilder.DropColumn(
                name: "IdUsuarioSubida",
                table: "DocumentosPaciente");

            migrationBuilder.DropColumn(
                name: "TamañoArchivo",
                table: "DocumentosPaciente");

            migrationBuilder.DropColumn(
                name: "Motivo",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "PrecioCita",
                table: "Citas");

            migrationBuilder.AlterColumn<string>(
                name: "TipoDocumento",
                table: "DocumentosPaciente",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "SubidoPor",
                table: "DocumentosPaciente",
                type: "nvarchar(80)",
                maxLength: 80,
                nullable: true);
        }
    }
}
