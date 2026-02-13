using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LEON___Sistema_di_gestione_ticket.Migrations
{
    /// <inheritdoc />
    public partial class statusModifiedFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "TicketStatusHistories");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "TicketStatusHistories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
