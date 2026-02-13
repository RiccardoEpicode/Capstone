using LEON___Sistema_di_gestione_ticket.Contracts;
using LEON___Sistema_di_gestione_ticket.Models.DTOs.Customer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LEON___Sistema_di_gestione_ticket.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Agent")] // Assuming only Admins and Agents can view customer lists
public class CustomersController : ControllerBase
{
    private readonly ITicketService _ticketService; // Using TicketService as it handles customer entities

    public CustomersController(ITicketService ticketService)
    {
        _ticketService = ticketService;
    }

    [HttpGet("all")] // Endpoint to get all customers
    public async Task<IActionResult> GetAllCustomers()
    {
        var customers = await _ticketService.GetAllCustomersAsync();
        return Ok(customers);
    }
}
