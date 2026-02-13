using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LEON___Sistema_di_gestione_ticket.Migrations
{
    /// <inheritdoc />
    public partial class update2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ChangedByAgentId",
                table: "TicketStatusHistories",
                newName: "ChangedByAgent");

            migrationBuilder.RenameColumn(
                name: "CreatedByAgentId",
                table: "Tickets",
                newName: "ChangedByAgent");

            migrationBuilder.RenameColumn(
                name: "AssignedAgentId",
                table: "Tickets",
                newName: "CreatedByAgent");

            migrationBuilder.AddColumn<string>(
                name: "AssignedAgent",
                table: "Tickets",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignedAgent",
                table: "Tickets");

            migrationBuilder.RenameColumn(
                name: "ChangedByAgent",
                table: "TicketStatusHistories",
                newName: "ChangedByAgentId");

            migrationBuilder.RenameColumn(
                name: "CreatedByAgent",
                table: "Tickets",
                newName: "AssignedAgentId");

            migrationBuilder.RenameColumn(
                name: "ChangedByAgent",
                table: "Tickets",
                newName: "CreatedByAgentId");
        }
    }
}
