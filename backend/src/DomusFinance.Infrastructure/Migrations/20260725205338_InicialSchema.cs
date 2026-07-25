using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DomusFinance.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InicialSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "pessoa",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    nome = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    idade = table.Column<int>(type: "integer", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pessoa", x => x.id);
                    table.CheckConstraint("ck_pessoa_idade", "idade >= 0 AND idade <= 130");
                });

            migrationBuilder.CreateTable(
                name: "usuario",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    nome = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    senha_hash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usuario", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "transacao",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    descricao = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    valor = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    tipo = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    data = table.Column<DateOnly>(type: "date", nullable: false),
                    categoria = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    pessoa_id = table.Column<Guid>(type: "uuid", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_transacao", x => x.id);
                    table.CheckConstraint("ck_transacao_categoria", "categoria IS NULL OR categoria IN ('Moradia','Alimentacao','Transporte','Saude','Educacao','Lazer','Contas','Outros')");
                    table.CheckConstraint("ck_transacao_tipo", "tipo IN ('Despesa', 'Receita')");
                    table.CheckConstraint("ck_transacao_valor_positivo", "valor > 0");
                    table.ForeignKey(
                        name: "FK_transacao_pessoa_pessoa_id",
                        column: x => x.pessoa_id,
                        principalTable: "pessoa",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_transacao_data",
                table: "transacao",
                column: "data");

            migrationBuilder.CreateIndex(
                name: "ix_transacao_pessoa_id",
                table: "transacao",
                column: "pessoa_id");

            migrationBuilder.CreateIndex(
                name: "ux_usuario_email",
                table: "usuario",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "transacao");

            migrationBuilder.DropTable(
                name: "usuario");

            migrationBuilder.DropTable(
                name: "pessoa");
        }
    }
}
