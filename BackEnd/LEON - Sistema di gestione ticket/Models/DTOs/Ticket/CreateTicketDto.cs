using LEON___Sistema_di_gestione_ticket.Models.DTOs.Notes;
using LEON___Sistema_di_gestione_ticket.Models.Enums;

namespace LEON___Sistema_di_gestione_ticket.Models.DTOs;

// DTO per la creazione di un ticket
public class CreateTicketDto
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public Priority Priority { get; set; }
    public Department TargetDepartment { get; set; }
    public TicketStatus? InitialStatus { get; set; }
    public string? AssignedAgent { get; set; }
    public int? CustomerId { get; set; }
    public CreateCustomerDto? Customer { get; set; }
    public CreateNotesDto? Notes { get; set; }
}