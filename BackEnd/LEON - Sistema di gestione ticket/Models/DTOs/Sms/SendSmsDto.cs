namespace LEON___Sistema_di_gestione_ticket.Models.DTOs.Sms;

public class SendSmsDto
{
    public string ToPhoneNumber { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? TicketId { get; set; }
}
