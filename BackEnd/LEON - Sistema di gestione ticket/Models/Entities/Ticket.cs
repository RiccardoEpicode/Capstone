using LEON___Sistema_di_gestione_ticket.Models.Enums;

namespace LEON___Sistema_di_gestione_ticket.Models.Entities;

// Entità che rappresenta un ticket di supporto
public class Ticket
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;

    public TicketStatus Status { get; set; }
    public Priority Priority { get; set; }
    public Department TargetDepartment { get; set; }

    public Customer? Customer { get; set; }

    public string ChangedByAgent { get; set; } = null!;

    public string? CreatedByAgent { get; set; }
    public string? AssignedAgent { get; set; }

    public DateTime CreatedAt { get; set; }

    public ICollection<TicketNote> Notes { get; set; } = new List<TicketNote>();
    public ICollection<TicketStatusHistory> StatusHistories { get; set; } = new List<TicketStatusHistory>();
}