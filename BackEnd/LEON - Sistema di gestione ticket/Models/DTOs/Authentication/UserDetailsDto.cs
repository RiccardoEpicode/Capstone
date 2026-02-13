namespace LEON___Sistema_di_gestione_ticket.Models.DTOs.Authentication;

public class UserDetailsDto
{
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? AgentType { get; set; } = "Not Assigned";
    public string phoneNumber { get; set; } = null!;
    public string Role { get; set; } = null!;
}
