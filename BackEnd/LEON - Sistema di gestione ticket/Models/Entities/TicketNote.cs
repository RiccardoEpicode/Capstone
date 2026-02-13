namespace LEON___Sistema_di_gestione_ticket.Models.Entities;

// Entità che rappresenta una nota associata a un ticket
public class TicketNote
{
    public int Id { get; set; }
    public string Content { get; set; }

    // Add these properties to fix CS1061
    public int TicketId { get; set; }
    public Ticket Ticket { get; set; }
}
