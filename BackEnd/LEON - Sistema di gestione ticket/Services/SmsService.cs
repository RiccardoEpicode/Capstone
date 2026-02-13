using Twilio;
using Twilio.Rest.Api.V2010.Account;
using LEON___Sistema_di_gestione_ticket.Contracts;

namespace LEON___Sistema_di_gestione_ticket.Services;

public class SmsService : ISmsService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SmsService> _logger;

    public SmsService(IConfiguration configuration, ILogger<SmsService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<bool> SendSmsAsync(string toPhoneNumber, string message)
    {
        var accountSid = _configuration["Twilio:AccountSid"];
        var authToken = _configuration["Twilio:AuthToken"];
        var fromPhone = _configuration["Twilio:FromPhoneNumber"];

        if (string.IsNullOrWhiteSpace(accountSid) ||
            string.IsNullOrWhiteSpace(authToken) ||
            string.IsNullOrWhiteSpace(fromPhone))
        {
            _logger.LogWarning("Twilio credentials are not configured. SMS not sent.");
            return false;
        }

        TwilioClient.Init(accountSid, authToken);

        var msg = await MessageResource.CreateAsync(
            body: message,
            from: new Twilio.Types.PhoneNumber(fromPhone),
            to: new Twilio.Types.PhoneNumber(toPhoneNumber)
        );

        _logger.LogInformation("Twilio SMS status: {Status} SID: {Sid}", msg.Status, msg.Sid);

        return msg.Status != MessageResource.StatusEnum.Failed &&
               msg.Status != MessageResource.StatusEnum.Undelivered;
    }
}
