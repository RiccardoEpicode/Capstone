using LEON___Sistema_di_gestione_ticket.Contracts;
using LEON___Sistema_di_gestione_ticket.Models.DTOs;
using LEON___Sistema_di_gestione_ticket.Models.DTOs.Ticket;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace LEON___Sistema_di_gestione_ticket.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;

    public TicketsController(ITicketService ticketService)
    {
        _ticketService = ticketService;
    }

    // Helper method to extract user identity and role from claims
    private (string UserId, string Role) GetUserIdentity()
    {
        var userId =
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        var role = User.FindFirstValue(ClaimTypes.Role);

        if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(role))
            throw new UnauthorizedAccessException("Missing user identity or role in token.");

        return (userId, role);
    }

    [Authorize(Roles = "Admin,Agent")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _ticketService.GetTicketsAsync());
    }

    [Authorize(Roles = "Admin,Agent")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var ticket = await _ticketService.GetTicketByIdAsync(id);
        if (ticket == null) return NotFound();

        return Ok(ticket);
    }

    [Authorize(Roles = "Admin,Agent")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTicketDto dto)
    {   // Get the userId if needed elsewhere, or just get role if not.
        var (userIdFromClaims, role) = GetUserIdentity(); 
       
        //ADD THESE LINES: Explicitly get the user's email from claims
        var actualUserEmail = User.FindFirstValue(ClaimTypes.Email);

        if (string.IsNullOrWhiteSpace(actualUserEmail))
        {
            throw new UnauthorizedAccessException("Missing user email in token.");
        }                
   
        //  CHANGE THIS LINE: Pass the actualUserEmail to the service
        var ticket = await _ticketService.CreateTicketAsync(dto, actualUserEmail, role);            
  
        return CreatedAtAction(nameof(GetById), new { id = ticket.Id }, ticket);
    }

    [Authorize(Roles = "Admin,Agent")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTicketDto dto)
    {
        var (userId, role) = GetUserIdentity();

        await _ticketService.UpdateTicketAsync(id, dto, userId, role);

        return NoContent();
    }

    [Authorize(Roles = "Admin,Agent")]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTicketStatusDto dto)
    {
        var (userId, role) = GetUserIdentity();

        await _ticketService.UpdateTicketStatusAsync(id, dto.NewStatus, userId, role);

        return NoContent();
    }

    [Authorize(Roles = "Admin,Agent")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var (userId, role) = GetUserIdentity();

        await _ticketService.DeleteTicketAsync(id, userId, role);

        return NoContent();
    }

    [Authorize(Roles = "Admin,Agent")]
    [HttpGet("{id}/history")]
    public async Task<IActionResult> GetHistory(int id)
    {
        return Ok(await _ticketService.GetTicketStatusHistoryAsync(id));
    }
}