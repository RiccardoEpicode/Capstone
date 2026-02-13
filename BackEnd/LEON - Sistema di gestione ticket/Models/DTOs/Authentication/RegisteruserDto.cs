namespace LEON___Sistema_di_gestione_ticket.Models.DTOs.Authentication;

// DTO per la registrazione di un utente
public class RegisteruserDto
{
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string? AgentType { get; set; } = null;
    public string? PhoneNumber { get; set; }
}