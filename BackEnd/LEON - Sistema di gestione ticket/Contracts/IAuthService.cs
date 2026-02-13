using LEON___Sistema_di_gestione_ticket.Models.DTOs.Authentication;

namespace LEON___Sistema_di_gestione_ticket.Contracts;

public interface IAuthService
{
    Task<List<UserDetailsDto>> GetAllUsersAsync();
    Task<UserDetailsDto> GetUserDetailsAsync(string userId);
    Task<string?> LoginAsync(LoginUserDto loginUserDto);
    Task<(bool Success, string? Token, List<string> Errors)> RegisterAsync(RegisteruserDto registeruserDto);
    Task<(bool Success, List<string> Errors)> UpdateUserAsync(string userName, UpdateUserDto dto);
    Task<(bool Success, List<string> Errors)> UpdateUserAndTrackChangesAsync(string userName, UpdateUserDto dto, string updaterId);

    // Delete methods
    Task<(bool Success, List<string> Errors)> SoftDeleteUserAsync(string userName, string deletedByUserId);
    Task<(bool Success, List<string> Errors)> HardDeleteUserAsync(string userName);
    Task<(bool Success, List<string> Errors)> RestoreUserAsync(string userName);
    Task<List<UserDetailsDto>> GetDeletedUsersAsync();
    Task<List<string>> GetRolesAsync();
}