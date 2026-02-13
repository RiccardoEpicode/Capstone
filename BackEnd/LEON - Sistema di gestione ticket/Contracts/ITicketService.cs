using LEON___Sistema_di_gestione_ticket.Models.DTOs;
using LEON___Sistema_di_gestione_ticket.Models.DTOs.Customer;
using LEON___Sistema_di_gestione_ticket.Models.Entities;
using LEON___Sistema_di_gestione_ticket.Models.Enums;

namespace LEON___Sistema_di_gestione_ticket.Contracts;

public interface ITicketService
{
    Task<GetTicketDto> CreateTicketAsync(CreateTicketDto dto, string userEmail, string role);

    Task<IEnumerable<GetTicketDto>> GetTicketsAsync();

    Task<GetTicketByIdDto?> GetTicketByIdAsync(int id);

    Task UpdateTicketAsync(int id, UpdateTicketDto dto, string userId, string role);

    Task UpdateTicketStatusAsync(int id, TicketStatus newStatus, string userId, string role);

    Task DeleteTicketAsync(int id, string userId, string role);

    Task<IEnumerable<TicketStatusHistory>> GetTicketStatusHistoryAsync(int ticketId);
    Task<IEnumerable<GetCustomerDto>> GetAllCustomersAsync();

    Task CreateTicketHistoryAsync(TicketStatusHistory history);
}