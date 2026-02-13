namespace LEON___Sistema_di_gestione_ticket.Models.DTOs.Authentication;

// DTO per il login dell'utente
public class LoginUserDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}