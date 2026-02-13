using LEON___Sistema_di_gestione_ticket.Models.Enums;

namespace LEON___Sistema_di_gestione_ticket.Models.DTOs;

// DTO per l'aggiornamento di un ticket
public class UpdateTicketDto
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public Priority Priority { get; set; }
    public Department TargetDepartment { get; set; }
    public string? AssignedAgent { get; set; }
}