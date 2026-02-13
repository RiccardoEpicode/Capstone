using LEON___Sistema_di_gestione_ticket.Models.Enums;

namespace LEON___Sistema_di_gestione_ticket.Models.DTOs.Ticket;

// DTO per l'aggiornamento dello stato di un ticket
public class UpdateTicketStatusDto
{
    public TicketStatus NewStatus { get; set; }
}