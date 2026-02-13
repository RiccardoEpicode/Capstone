using LEON___Sistema_di_gestione_ticket.Contracts;
using LEON___Sistema_di_gestione_ticket.Models.DTOs.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace LEON___Sistema_di_gestione_ticket.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisteruserDto dto)
    {
        var (success, token, errors) = await _authService.RegisterAsync(dto);

        if (!success)
            return BadRequest(new { message = "User creation failed", errors });

        return Ok(new { token });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginUserDto dto)
    {
        var token = await _authService.LoginAsync(dto);

        if (token == null)
            return Unauthorized();

        return Ok(new { token });
    }

    [Authorize(Roles = "Admin, Agent")]
    [HttpGet("user-details")]
    public async Task<IActionResult> GetUserDetails()
    {
        var userId =
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized("Missing user identity in token.");
        var userDetails = await _authService.GetUserDetailsAsync(userId);
        if (userDetails == null)
            return NotFound("User not found.");
        return Ok(userDetails);
    }

    [Authorize(Roles = "Admin, Agent")]
    [HttpGet("all-users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _authService.GetAllUsersAsync();
        return Ok(users);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("roles")]
    public async Task<IActionResult> GetRoles()
    {
        var roles = await _authService.GetRolesAsync();
        return Ok(roles);
    }

    [Authorize(Roles = "Admin, Agent")]
    [HttpPut("update-user/{userName}")]
    public async Task<IActionResult> UpdateUser(string userName, UpdateUserDto dto)
    {
        var updaterId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (string.IsNullOrWhiteSpace(updaterId))
            return Unauthorized("Missing user identity in token.");

        var (success, errors) = await _authService.UpdateUserAndTrackChangesAsync(userName, dto, updaterId);
        if (!success)
            return BadRequest(new { message = "User update failed", errors });
        return Ok(new { message = "User updated successfully" });
    }

    // ========== SOFT DELETE ==========
    // Marca l'utente come cancellato (recuperabile)
    [Authorize(Roles = "Admin")]
    [HttpDelete("soft-delete-user/{userName}")]
    public async Task<IActionResult> SoftDeleteUser(string userName)
    {
        var deletedByUserId =
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (string.IsNullOrWhiteSpace(deletedByUserId))
            return Unauthorized("Missing user identity in token.");

        var (success, errors) = await _authService.SoftDeleteUserAsync(userName, deletedByUserId);
        if (!success)
            return BadRequest(new { message = "Soft delete failed", errors });

        return Ok(new { message = "User soft-deleted successfully (can be restored)" });
    }

    // ========== HARD DELETE ==========
    // Elimina PERMANENTEMENTE l'utente (NON recuperabile)
    [Authorize(Roles = "Admin")]
    [HttpDelete("hard-delete-user/{userName}")]
    public async Task<IActionResult> HardDeleteUser(string userName)
    {
        var (success, errors) = await _authService.HardDeleteUserAsync(userName);
        if (!success)
            return BadRequest(new { message = "Hard delete failed", errors });

        return Ok(new { message = "User permanently deleted (CANNOT be restored)" });
    }

    // ========== RESTORE USER ==========
    // Ripristina un utente soft-deleted
    [Authorize(Roles = "Admin")]
    [HttpPost("restore-user/{userName}")]
    public async Task<IActionResult> RestoreUser(string userName)
    {
        var (success, errors) = await _authService.RestoreUserAsync(userName);
        if (!success)
            return BadRequest(new { message = "Restore failed", errors });

        return Ok(new { message = "User restored successfully" });
    }

    // ========== GET DELETED USERS ==========
    // Ottiene la lista degli utenti soft-deleted
    [Authorize(Roles = "Admin")]
    [HttpGet("deleted-users")]
    public async Task<IActionResult> GetDeletedUsers()
    {
        var users = await _authService.GetDeletedUsersAsync();
        return Ok(users);
    }
}
