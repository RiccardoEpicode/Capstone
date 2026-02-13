using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LEON___Sistema_di_gestione_ticket.Migrations
{
    /// <inheritdoc />
    public partial class updateTicketTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AssignedAgentId",
                table: "Tickets",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignedAgentId",
                table: "Tickets");
        }
    }
}
