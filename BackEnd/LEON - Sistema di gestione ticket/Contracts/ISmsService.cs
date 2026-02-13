namespace LEON___Sistema_di_gestione_ticket.Contracts;

public interface ISmsService
{
    Task<bool> SendSmsAsync(string toPhoneNumber, string message);
}
