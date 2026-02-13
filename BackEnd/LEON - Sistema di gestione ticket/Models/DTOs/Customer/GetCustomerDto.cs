namespace LEON___Sistema_di_gestione_ticket.Models.DTOs.Customer;

public class GetCustomerDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
}
