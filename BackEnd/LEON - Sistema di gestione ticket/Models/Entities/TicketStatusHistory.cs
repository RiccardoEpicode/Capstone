using LEON___Sistema_di_gestione_ticket.Models.DTOs.Notes;
using LEON___Sistema_di_gestione_ticket.Models.Enums;

namespace LEON___Sistema_di_gestione_ticket.Models.Entities;

// Entità che rappresenta la cronologia delle modifiche di stato di un ticket
public class TicketStatusHistory
{
    // ID univoco della modifica di stato
    public int Id { get; set; }
    // ID del ticket associato alla modifica di stato
    public int TicketId { get; set; }
    // Ticket associato alla modifica di stato
    public Ticket Ticket { get; set; } = null!;

    // Descrizione della modifica di stato
    public string Description { get; set; } = null!;

    // Stato precedente e nuovo stato del ticket
    public TicketStatus OldStatus { get; set; }
    public TicketStatus NewStatus { get; set; }

    // Note sulle modifiche apportate allo stato del ticket
    public TicketNote? OldNotes { get; set; }
    public TicketNote? NewNotes { get; set; }

    // Informazioni sull'agente che ha effettuato la modifica
    public string ChangedByAgent { get; set; } = null!;
    // Data e ora della modifica
    public DateTime ChangedAt { get; set; }

}