using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LEON___Sistema_di_gestione_ticket.Contracts;
using LEON___Sistema_di_gestione_ticket.Models.DTOs.Sms;

namespace LEON___Sistema_di_gestione_ticket.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Agent")]
public class SmsController : ControllerBase
{
    private readonly ISmsService _smsService;
    private readonly IConfiguration _configuration;

    public SmsController(ISmsService smsService, IConfiguration configuration)
    {
        _smsService = smsService;
        _configuration = configuration;
    }

    [HttpGet("status")]
    public IActionResult GetStatus()
    {
        var connected =
            !string.IsNullOrWhiteSpace(_configuration["Twilio:AccountSid"]) &&
            !string.IsNullOrWhiteSpace(_configuration["Twilio:AuthToken"]) &&
            !string.IsNullOrWhiteSpace(_configuration["Twilio:FromPhoneNumber"]);

        return Ok(new { connected });
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendSms([FromBody] SendSmsDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.ToPhoneNumber) || string.IsNullOrWhiteSpace(dto.Message))
            return BadRequest(new { error = "Phone number and message are required." });

        var success = await _smsService.SendSmsAsync(dto.ToPhoneNumber, dto.Message);

        if (!success)
            return StatusCode(503, new { error = "SMS could not be delivered. Verify Twilio credentials in Azure App Configuration." });

        return Ok(new { message = "SMS sent successfully." });
    }
}
