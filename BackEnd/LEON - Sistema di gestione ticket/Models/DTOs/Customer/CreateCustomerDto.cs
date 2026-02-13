namespace LEON___Sistema_di_gestione_ticket.Models.DTOs;

// DTO per la creazione di un cliente (senza ID)
public class CreateCustomerDto
{
    public string FullName { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string? Email { get; set; }
}
