using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LEON___Sistema_di_gestione_ticket.Migrations
{
    /// <inheritdoc />
    public partial class updateTrackChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TicketNotes_Tickets_TicketId1",
                table: "TicketNotes");

            migrationBuilder.DropIndex(
                name: "IX_TicketNotes_TicketId1",
                table: "TicketNotes");

            migrationBuilder.DropColumn(
                name: "TicketId1",
                table: "TicketNotes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TicketId1",
                table: "TicketNotes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TicketNotes_TicketId1",
                table: "TicketNotes",
                column: "TicketId1",
                unique: true,
                filter: "[TicketId1] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_TicketNotes_Tickets_TicketId1",
                table: "TicketNotes",
                column: "TicketId1",
                principalTable: "Tickets",
                principalColumn: "Id");
        }
    }
}
