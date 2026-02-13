#nullable enable
using LEON___Sistema_di_gestione_ticket.Models.Enums;

namespace LEON___Sistema_di_gestione_ticket.Models.DTOs;

// DTO per ottenere i dettagli di un ticket tramite il suo ID
public class GetTicketDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public TicketStatus Status { get; set; }
    public Priority Priority { get; set; }
    public Department TargetDepartment { get; set; }
    public string CreatedByAgent { get; set; }
    public string CreatedByAgentName { get; set; }
    public string? AssignedAgent { get; set; }
    public string? AssignedAgentName { get; set; }
    public DateTime CreatedAt { get; set; }
    public int? CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public string? CustomerPhoneNumber { get; set; } 
    public string? CustomerEmail { get; set; }
    public string? TicketNoteContent { get; set; }
}