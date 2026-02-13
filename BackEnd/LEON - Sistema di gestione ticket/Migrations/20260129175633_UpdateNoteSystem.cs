using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LEON___Sistema_di_gestione_ticket.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNoteSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "TicketNotes");

            migrationBuilder.DropColumn(
                name: "CreatedByAgentId",
                table: "TicketNotes");

            migrationBuilder.DropColumn(
                name: "IsInternal",
                table: "TicketNotes");

            migrationBuilder.AddColumn<int>(
                name: "NewNotesId",
                table: "TicketStatusHistories",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OldNotesId",
                table: "TicketStatusHistories",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TicketId1",
                table: "TicketNotes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TicketStatusHistories_NewNotesId",
                table: "TicketStatusHistories",
                column: "NewNotesId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketStatusHistories_OldNotesId",
                table: "TicketStatusHistories",
                column: "OldNotesId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_TicketStatusHistories_TicketNotes_NewNotesId",
                table: "TicketStatusHistories",
                column: "NewNotesId",
                principalTable: "TicketNotes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TicketStatusHistories_TicketNotes_OldNotesId",
                table: "TicketStatusHistories",
                column: "OldNotesId",
                principalTable: "TicketNotes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TicketNotes_Tickets_TicketId1",
                table: "TicketNotes");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketStatusHistories_TicketNotes_NewNotesId",
                table: "TicketStatusHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketStatusHistories_TicketNotes_OldNotesId",
                table: "TicketStatusHistories");

            migrationBuilder.DropIndex(
                name: "IX_TicketStatusHistories_NewNotesId",
                table: "TicketStatusHistories");

            migrationBuilder.DropIndex(
                name: "IX_TicketStatusHistories_OldNotesId",
                table: "TicketStatusHistories");

            migrationBuilder.DropIndex(
                name: "IX_TicketNotes_TicketId1",
                table: "TicketNotes");

            migrationBuilder.DropColumn(
                name: "NewNotesId",
                table: "TicketStatusHistories");

            migrationBuilder.DropColumn(
                name: "OldNotesId",
                table: "TicketStatusHistories");

            migrationBuilder.DropColumn(
                name: "TicketId1",
                table: "TicketNotes");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "TicketNotes",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedByAgentId",
                table: "TicketNotes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsInternal",
                table: "TicketNotes",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
