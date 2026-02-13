namespace LEON___Sistema_di_gestione_ticket.Models.DTOs.Authentication
{
    public class UpdateUserDto
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Password { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string? AgentType { get; set; } = null;
        public string? PhoneNumber { get; set; }
    }
}
