using LEON___Sistema_di_gestione_ticket.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace LEON___Sistema_di_gestione_ticket.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnumsController : ControllerBase
    {
        [HttpGet("departments")]
        public IActionResult GetDepartments()
        {
            var departments = Enum.GetValues(typeof(Department))
                .Cast<Department>()
                .Select(d => d.ToString())
                .ToList();
            return Ok(departments);
        }

        [HttpGet("priorities")]
        public IActionResult GetPriorities()
        {
            var priorities = Enum.GetValues(typeof(Priority))
                .Cast<Priority>()
                .Select(p => p.ToString())
                .ToList();
            return Ok(priorities);
        }
    }
}
