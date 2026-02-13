using Microsoft.AspNetCore.Identity;

namespace LEON___Sistema_di_gestione_ticket.Data;

public class ApplicationUser : IdentityUser
{
    public string? FullName { get; set; }
    public string? AgentType { get; set; } // es: "CallCenter", "Tech", ecc.

    // Soft Delete fields
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy { get; set; } // ID of admin who deleted the user
}
