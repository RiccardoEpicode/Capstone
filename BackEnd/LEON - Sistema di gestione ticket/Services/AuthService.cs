using LEON___Sistema_di_gestione_ticket.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using LEON___Sistema_di_gestione_ticket.Models.DTOs.Authentication;
using LEON___Sistema_di_gestione_ticket.Contracts;
using Microsoft.EntityFrameworkCore;
using LEON___Sistema_di_gestione_ticket.Models.Entities;

namespace LEON___Sistema_di_gestione_ticket.Services;

public class AuthService : IAuthService
{
    // Dependencies
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;
    private readonly ITicketService _ticketService;
    private readonly ApplicationDbContext _context;

    // Costruttore
    public AuthService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, ITicketService ticketService, ApplicationDbContext context)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
        _ticketService = ticketService;
        _context = context;
    }

    public async Task<List<string>> GetRolesAsync()
    {
        var roles = await _roleManager.Roles.Select(r => r.Name).ToListAsync();
        return roles;
    }

    // Metodo di login
    public async Task<string?> LoginAsync(LoginUserDto loginUserDto)
    {
        var user = await _userManager.FindByEmailAsync(loginUserDto.Email);
        if (user == null)
            return null;

        if (!await _userManager.CheckPasswordAsync(user, loginUserDto.Password))
            return null;

        return await GenerateJwtToken(user);
    }
    // Metodo di registrazione
    public async Task<(bool Success, string? Token, List<string> Errors)> RegisterAsync(RegisteruserDto dto)
    {
        var errors = new List<string>();

        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            errors.Add("A user with this email already exists.");
            return (false, null, errors);
        }

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FullName = dto.FullName,
            AgentType = dto.AgentType,
            PhoneNumber = dto.PhoneNumber
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            errors.AddRange(result.Errors.Select(e => e.Description));
            return (false, null, errors);
        }

        var roleResult = await _userManager.AddToRoleAsync(user, dto.Role);
        if (!roleResult.Succeeded)
        {
            errors.AddRange(roleResult.Errors.Select(e => e.Description));
            return (false, null, errors);
        }

        var token = await GenerateJwtToken(user);
        return (true, token, errors);
    }

    // Metodo per ottenere i dettagli dell'utente
    public async Task<UserDetailsDto> GetUserDetailsAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return null;
        var roles = await _userManager.GetRolesAsync(user);
        return new UserDetailsDto
        {
            Email = user.Email,
            FullName = user.FullName,
            AgentType = user.AgentType,
            phoneNumber = user.PhoneNumber,
            Role = roles.FirstOrDefault() ?? string.Empty
        };
    }

    //Metodo per visualizzare tutti gli utenti (esclusi quelli soft-deleted)
    public async Task<List<UserDetailsDto>> GetAllUsersAsync()
    {
        // Filtra utenti NON cancellati (soft delete)
        var users = _userManager.Users.Where(u => !u.IsDeleted).ToList();
        var userDetailsList = new List<UserDetailsDto>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userDetailsList.Add(new UserDetailsDto
            {
                Email = user.Email,
                FullName = user.FullName,
                AgentType = user.AgentType ?? "Not Assigned",
                phoneNumber = user.PhoneNumber,
                Role = roles.FirstOrDefault() ?? string.Empty
            });
        }
        return userDetailsList;
    }

    //Metodo per modificare gli utenti
    public async Task<(bool Success, List<string> Errors)> UpdateUserAsync(string userName, UpdateUserDto dto)
    {
        var errors = new List<string>();
        var user = await _userManager.FindByNameAsync(userName);
        if (user == null)
        {
            errors.Add("User not found.");
            return (false, errors);
        }
        user.FullName = dto.FullName;
        user.AgentType = dto.AgentType;
        user.PhoneNumber = dto.PhoneNumber;
        user.Email = dto.Email;
        user.UserName = dto.Email;
        if (!string.IsNullOrEmpty(dto.Password))
        {
            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, dto.Password);
        }
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            errors.AddRange(result.Errors.Select(e => e.Description));
            return (false, errors);
        }
        var currentRoles = await _userManager.GetRolesAsync(user);
        if (!currentRoles.Contains(dto.Role))
        {
            var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeResult.Succeeded)
            {
                errors.AddRange(removeResult.Errors.Select(e => e.Description));
                return (false, errors);
            }
            var addResult = await _userManager.AddToRoleAsync(user, dto.Role);
            if (!addResult.Succeeded)
            {
                errors.AddRange(addResult.Errors.Select(e => e.Description));
                return (false, errors);
            }
        }
        return (true, errors);
    }

    public async Task<(bool Success, List<string> Errors)> UpdateUserAndTrackChangesAsync(string userName, UpdateUserDto dto, string updaterId)
    {
        var errors = new List<string>();
        var user = await _userManager.FindByNameAsync(userName);
        if (user == null)
        {
            errors.Add("User not found.");
            return (false, errors);
        }

        var oldUserData = new
        {
            user.FullName,
            user.AgentType,
            user.PhoneNumber,
            user.Email,
            Roles = await _userManager.GetRolesAsync(user)
        };

        user.FullName = dto.FullName;
        user.AgentType = dto.AgentType;
        user.PhoneNumber = dto.PhoneNumber;
        user.Email = dto.Email;
        user.UserName = dto.Email;
        if (!string.IsNullOrEmpty(dto.Password))
        {
            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, dto.Password);
        }

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            errors.AddRange(result.Errors.Select(e => e.Description));
            return (false, errors);
        }

        var currentRoles = await _userManager.GetRolesAsync(user);
        if (!currentRoles.Contains(dto.Role))
        {
            var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeResult.Succeeded)
            {
                errors.AddRange(removeResult.Errors.Select(e => e.Description));
                return (false, errors);
            }
            var addResult = await _userManager.AddToRoleAsync(user, dto.Role);
            if (!addResult.Succeeded)
            {
                errors.AddRange(addResult.Errors.Select(e => e.Description));
                return (false, errors);
            }
        }

        var newRoles = await _userManager.GetRolesAsync(user);
        var changes = new List<string>();
        if (oldUserData.FullName != user.FullName)
            changes.Add($"FullName changed from '{oldUserData.FullName}' to '{user.FullName}'");
        if (oldUserData.AgentType != user.AgentType)
            changes.Add($"AgentType changed from '{oldUserData.AgentType}' to '{user.AgentType}'");
        if (oldUserData.PhoneNumber != user.PhoneNumber)
            changes.Add($"PhoneNumber changed from '{oldUserData.PhoneNumber}' to '{user.PhoneNumber}'");
        if (oldUserData.Email != user.Email)
            changes.Add($"Email changed from '{oldUserData.Email}' to '{user.Email}'");
        if (!oldUserData.Roles.SequenceEqual(newRoles))
            changes.Add($"Roles changed from '{string.Join(", ", oldUserData.Roles)}' to '{string.Join(", ", newRoles)}'");

        if (changes.Any())
        {
            var tickets = await _context.Tickets
                .Where(t => t.AssignedAgent == user.Id || t.CreatedByAgent == user.Id)
                .ToListAsync();
            foreach (var ticket in tickets)
            {
                var history = new TicketStatusHistory
                {
                    TicketId = ticket.Id,
                    Description = $"User {user.UserName} updated: {string.Join(", ", changes)}",
                    ChangedByAgent = updaterId,
                    ChangedAt = DateTime.UtcNow
                };
                await _ticketService.CreateTicketHistoryAsync(history);
            }
        }

        return (true, errors);
    }

    // ========== SOFT DELETE ==========
    // Segna l'utente come cancellato ma mantiene i dati nel database
    // Vantaggi: recuperabile, mantiene storico, preserva integrità referenziale
    public async Task<(bool Success, List<string> Errors)> SoftDeleteUserAsync(string userName, string deletedByUserId)
    {
        var errors = new List<string>();
        var user = await _userManager.FindByNameAsync(userName);

        if (user == null)
        {
            errors.Add("User not found.");
            return (false, errors);
        }

        if (user.IsDeleted)
        {
            errors.Add("User is already deleted.");
            return (false, errors);
        }

        // Marca l'utente come cancellato
        user.IsDeleted = true;
        user.DeletedAt = DateTime.UtcNow;
        user.DeletedBy = deletedByUserId;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            errors.AddRange(result.Errors.Select(e => e.Description));
            return (false, errors);
        }

        return (true, errors);
    }

    // ========== HARD DELETE ==========
    // Elimina permanentemente l'utente dal database
    // Attenzione: DATI PERSI DEFINITIVAMENTE - non recuperabile!
    public async Task<(bool Success, List<string> Errors)> HardDeleteUserAsync(string userName)
    {
        var errors = new List<string>();
        var user = await _userManager.FindByNameAsync(userName);

        if (user == null)
        {
            errors.Add("User not found.");
            return (false, errors);
        }

        // ELIMINA DEFINITIVAMENTE dal database
        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            errors.AddRange(result.Errors.Select(e => e.Description));
            return (false, errors);
        }

        return (true, errors);
    }

    // ========== RESTORE SOFT-DELETED USER ==========
    // Ripristina un utente precedentemente soft-deleted
    public async Task<(bool Success, List<string> Errors)> RestoreUserAsync(string userName)
    {
        var errors = new List<string>();

        // Cerca anche tra gli utenti cancellati
        var user = await _userManager.Users
            .FirstOrDefaultAsync(u => u.UserName == userName);

        if (user == null)
        {
            errors.Add("User not found.");
            return (false, errors);
        }

        if (!user.IsDeleted)
        {
            errors.Add("User is not deleted.");
            return (false, errors);
        }

        // Ripristina l'utente
        user.IsDeleted = false;
        user.DeletedAt = null;
        user.DeletedBy = null;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            errors.AddRange(result.Errors.Select(e => e.Description));
            return (false, errors);
        }

        return (true, errors);
    }

    // ========== GET DELETED USERS ==========
    // Ottiene la lista degli utenti soft-deleted (per eventuale ripristino)
    public async Task<List<UserDetailsDto>> GetDeletedUsersAsync()
    {
        var users = _userManager.Users.Where(u => u.IsDeleted).ToList();
        var userDetailsList = new List<UserDetailsDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userDetailsList.Add(new UserDetailsDto
            {
                Email = user.Email,
                FullName = user.FullName,
                AgentType = user.AgentType,
                phoneNumber = user.PhoneNumber,
                Role = roles.FirstOrDefault() ?? string.Empty
            });
        }

        return userDetailsList;
    }

    // Generazione del token JWT
    private async Task<string> GenerateJwtToken(ApplicationUser user)
    {
        // creazione dei claims
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Name, user.FullName)
        };

        //aggiunta dei ruoli ai claims
        var roles = await _userManager.GetRolesAsync(user);
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        // generazione delle credenziali di firma
        var secret = _configuration["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(secret) || secret.Length < 32)
            throw new InvalidOperationException("JWT key missing or too short.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // creazione del token
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(int.Parse(_configuration["Jwt:DurationInMinutes"]!)),
            signingCredentials: creds
        );

        // restituzione del token serializzato
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}