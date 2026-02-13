using LEON___Sistema_di_gestione_ticket.Contracts;
using LEON___Sistema_di_gestione_ticket.Data;
using LEON___Sistema_di_gestione_ticket.Models.DTOs;
using LEON___Sistema_di_gestione_ticket.Models.DTOs.Customer;
using LEON___Sistema_di_gestione_ticket.Models.Entities;
using LEON___Sistema_di_gestione_ticket.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace LEON___Sistema_di_gestione_ticket.Services;

public class TicketService : ITicketService
{
    private readonly ApplicationDbContext _context;

    public TicketService(ApplicationDbContext context)
    {
        _context = context;
    }

    // CREATE
    public async Task<GetTicketDto> CreateTicketAsync(CreateTicketDto dto, string userEmail, string role)
    {
        var initialStatus = dto.InitialStatus ?? TicketStatus.Open;
        var ticket = new Ticket
        {
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority,
            TargetDepartment = dto.TargetDepartment,
            CreatedByAgent = userEmail,
            ChangedByAgent = userEmail,
            AssignedAgent = dto.AssignedAgent,
            Status = initialStatus,
            CreatedAt = DateTime.UtcNow,
            Customer = dto.CustomerId.HasValue 
                ? await _context.Customers.FindAsync(dto.CustomerId.Value) 
                : (dto.Customer != null 
                    ? new Customer
                    {
                        FullName = dto.Customer.FullName,
                        PhoneNumber = dto.Customer.PhoneNumber,
                        Email = dto.Customer.Email
                    }
                    : null),
        };

        if (dto.Notes != null)
        {
            var note = new TicketNote { Content = dto.Notes.Content };
            ticket.Notes.Add(note);
        }

        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();

        var history = new TicketStatusHistory
        {
            TicketId = ticket.Id,
            OldStatus = TicketStatus.Open,
            NewStatus = initialStatus,
            ChangedByAgent = userEmail,
            ChangedAt = DateTime.UtcNow,
            Description = $"Ticket created with initial status {initialStatus}",
            NewNotes = ticket.Notes.LastOrDefault()
        };

        _context.TicketStatusHistories.Add(history);
        await _context.SaveChangesAsync();

        return new GetTicketDto
        {
            Id = ticket.Id,
            Title = ticket.Title,
            Description = ticket.Description,
            Status = ticket.Status,
            Priority = ticket.Priority,
            TargetDepartment = ticket.TargetDepartment,
            CreatedByAgent = ticket.CreatedByAgent,
            AssignedAgent = ticket.AssignedAgent,
            CreatedAt = ticket.CreatedAt,
            CustomerId = ticket.Customer?.Id,
            CustomerName = ticket.Customer?.FullName,
            CustomerPhoneNumber = ticket.Customer?.PhoneNumber,
            CustomerEmail = ticket.Customer?.Email,
            TicketNoteContent = ticket.Notes.LastOrDefault()?.Content
        };
    }

    // READ ALL
    public async Task<IEnumerable<GetTicketDto>> GetTicketsAsync()
    {
        var tickets = await _context.Tickets
            .Include(t => t.Customer)
            .Include(t => t.Notes)
            .Select(t => new
            {
                Ticket = t,
                CreatedByAgentName = _context.Users.FirstOrDefault(u => u.Id == t.CreatedByAgent).FullName,
                AssignedAgentName = t.AssignedAgent != null ? _context.Users.FirstOrDefault(u => u.Id == t.AssignedAgent).FullName : null
            })
            .ToListAsync();

        return tickets.Select(t => new GetTicketDto
        {
            Id = t.Ticket.Id,
            Title = t.Ticket.Title,
            Description = t.Ticket.Description,
            Status = t.Ticket.Status,
            Priority = t.Ticket.Priority,
            TargetDepartment = t.Ticket.TargetDepartment,
            CreatedByAgent = t.Ticket.CreatedByAgent,
            CreatedByAgentName = t.CreatedByAgentName,
            AssignedAgent = t.Ticket.AssignedAgent,
            AssignedAgentName = t.AssignedAgentName,
            CreatedAt = t.Ticket.CreatedAt,
            CustomerId = t.Ticket.Customer?.Id,
            CustomerName = t.Ticket.Customer?.FullName,
            CustomerPhoneNumber = t.Ticket.Customer?.PhoneNumber,
            CustomerEmail = t.Ticket.Customer?.Email,
            TicketNoteContent = t.Ticket.Notes.OrderByDescending(n => n.Id).FirstOrDefault()?.Content
        });
    }

    // READ BY ID
    public async Task<GetTicketByIdDto?> GetTicketByIdAsync(int id)
    {
        var ticket = await _context.Tickets
            .Include(t => t.Customer)
            .Include(t => t.Notes)
            .Where(t => t.Id == id)
            .Select(t => new
            {
                Ticket = t,
                CreatedByAgentName = _context.Users.FirstOrDefault(u => u.Id == t.CreatedByAgent).FullName,
                AssignedAgentName = t.AssignedAgent != null ? _context.Users.FirstOrDefault(u => u.Id == t.AssignedAgent).FullName : null
            })
            .FirstOrDefaultAsync();

        if (ticket == null)
        {
            return null;
        }

        return new GetTicketByIdDto
        {
            Id = ticket.Ticket.Id,
            Title = ticket.Ticket.Title,
            Description = ticket.Ticket.Description,
            Status = ticket.Ticket.Status,
            Priority = ticket.Ticket.Priority,
            TargetDepartment = ticket.Ticket.TargetDepartment,
            CreatedByAgent = ticket.Ticket.CreatedByAgent,
            CreatedByAgentName = ticket.CreatedByAgentName,
            AssignedAgent = ticket.Ticket.AssignedAgent,
            AssignedAgentName = ticket.AssignedAgentName,
            CreatedAt = ticket.Ticket.CreatedAt,
            CustomerId = ticket.Ticket.Customer?.Id,
            CustomerName = ticket.Ticket.Customer?.FullName,
            CustomerPhoneNumber = ticket.Ticket.Customer?.PhoneNumber,
            CustomerEmail = ticket.Ticket.Customer?.Email,
            TicketNoteContent = ticket.Ticket.Notes.OrderByDescending(n => n.Id).FirstOrDefault()?.Content
        };
    }

    // UPDATE (FULL - NO STATUS CHANGE HERE)
    public async Task UpdateTicketAsync(int id, UpdateTicketDto dto, string userId, string role)
    {
        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket == null)
            throw new Exception("Ticket not found");

        ticket.Title = dto.Title;
        ticket.Description = dto.Description;
        ticket.Priority = dto.Priority;
        ticket.TargetDepartment = dto.TargetDepartment;
        ticket.AssignedAgent = dto.AssignedAgent;

        await _context.SaveChangesAsync();
    }

    // UPDATE STATUS ONLY (WRITES HISTORY)
    public async Task UpdateTicketStatusAsync(int id, TicketStatus newStatus, string userId, string role)
    {
        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket == null)
            throw new Exception("Ticket not found");

        if (ticket.Status == newStatus)
            return;

        var oldStatus = ticket.Status;

        // (qui dopo inseriamo IsValidTransition(oldStatus, newStatus, role))
        ticket.Status = newStatus;

        _context.TicketStatusHistories.Add(new TicketStatusHistory
        {
            TicketId = ticket.Id,
            OldStatus = oldStatus,
            NewStatus = newStatus,
            ChangedByAgent = userId,
            ChangedAt = DateTime.UtcNow,
            Description = $"Status changed from {oldStatus} to {newStatus} by {role}."
        });

        await _context.SaveChangesAsync();
    }

    // DELETE
    public async Task DeleteTicketAsync(int id, string userId, string role)
    {
        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket == null)
            throw new Exception("Ticket not found");

        _context.Tickets.Remove(ticket);
        await _context.SaveChangesAsync();
    }

    // HISTORY
    public async Task<IEnumerable<TicketStatusHistory>> GetTicketStatusHistoryAsync(int ticketId)
    {
        return await _context.TicketStatusHistories
            .Where(h => h.TicketId == ticketId)
            .Include(h => h.Ticket)
            .Select(h => new TicketStatusHistory
            {
                Id = h.Id,
                TicketId = h.TicketId,
                OldStatus = h.OldStatus,                
                NewStatus = h.NewStatus,
                Description = h.Ticket.Description,
                ChangedByAgent = h.ChangedByAgent,
                ChangedAt = h.ChangedAt,
                OldNotes = h.OldNotes,
                NewNotes = h.NewNotes
            })
            .ToListAsync();
    }

    //WE NEED ONE FOR GETTING THE TICKETS BY NAME OR STATUS ETC. TO USE SEARCH FUNCTIONALITY
    public async Task<IEnumerable<GetTicketDto>> SearchTicketsAsync(string? title, TicketStatus? status, string? targetDepartment)
    {
        var query = _context.Tickets.AsQueryable();

        if (!string.IsNullOrEmpty(title))
        {
            query = query.Where(t => t.Title.Contains(title));
        }

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        if (!string.IsNullOrEmpty(targetDepartment))
        {
            if (Enum.TryParse<Department>(targetDepartment, out var departmentEnum))
            {
                query = query.Where(t => t.TargetDepartment == departmentEnum);
            }
        }

        var tickets = await query
            .Include(t => t.Customer)
            .Include(t => t.Notes)
            .Select(t => new
            {
                Ticket = t,
                CreatedByAgentName = _context.Users.FirstOrDefault(u => u.Id == t.CreatedByAgent).FullName,
                AssignedAgentName = t.AssignedAgent != null ? _context.Users.FirstOrDefault(u => u.Id == t.AssignedAgent).FullName : null
            })
            .ToListAsync();

        return tickets.Select(t => new GetTicketDto
        {
            Id = t.Ticket.Id,
            Title = t.Ticket.Title,
            Description = t.Ticket.Description,
            Status = t.Ticket.Status,
            TargetDepartment = t.Ticket.TargetDepartment,
            CreatedByAgent = t.Ticket.CreatedByAgent,
            CreatedByAgentName = t.CreatedByAgentName,
            AssignedAgent = t.Ticket.AssignedAgent,
            AssignedAgentName = t.AssignedAgentName,
            CreatedAt = t.Ticket.CreatedAt,
            CustomerId = t.Ticket.Customer?.Id,
            CustomerName = t.Ticket.Customer?.FullName,
            CustomerPhoneNumber = t.Ticket.Customer?.PhoneNumber,
            CustomerEmail = t.Ticket.Customer?.Email,
            TicketNoteContent = t.Ticket.Notes.OrderByDescending(n => n.Id).FirstOrDefault()?.Content
        });
    }
    public void Dispose()
    {
        _context.Dispose();
    }

    public async Task CreateTicketHistoryAsync(TicketStatusHistory history)
    {
        _context.TicketStatusHistories.Add(history);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<GetCustomerDto>> GetAllCustomersAsync()
    {
        return await _context.Customers
            .Select(c => new GetCustomerDto
            {
                Id = c.Id,
                FullName = c.FullName,
                Email = c.Email,
                PhoneNumber = c.PhoneNumber
            })
            .ToListAsync();
    }
}