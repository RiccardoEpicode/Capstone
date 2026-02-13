namespace LEON___Sistema_di_gestione_ticket.Models.Entities;

// Entità che rappresenta un cliente nel sistema di gestione ticket
public class Customer
{
    public int Id { get; set; }

    public string FullName { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string? Email { get; set; }
}
