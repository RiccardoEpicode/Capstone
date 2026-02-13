using LEON___Sistema_di_gestione_ticket.Models.Enums;

namespace LEON___Sistema_di_gestione_ticket.Models.DTOs;

// DTO per ottenere i dettagli di un ticket tramite il suo ID
public class GetTicketByIdDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public TicketStatus Status { get; set; }
    public Priority Priority { get; set; }
    public Department TargetDepartment { get; set; }
    public string CreatedByAgent { get; set; } = null!;
    public string? AssignedAgent { get; set; }
    public int? CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public string? CustomerPhoneNumber { get; set; }
    public string? CustomerEmail { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? TicketNoteContent { get; set; }
    public string CreatedByAgentName { get; set; } = null!;
    public string? AssignedAgentName { get; set; }
}