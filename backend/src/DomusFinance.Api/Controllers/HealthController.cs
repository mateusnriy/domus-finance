using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DomusFinance.Api.Controllers;

[ApiController]
[Route("health")]
[AllowAnonymous]
public class HealthController : ControllerBase
{
    // Confirma que o servidor responde. Não verifica o banco: a prontidão para
    // consultas é resolvida pelo retry de migrations na inicialização.
    [HttpGet]
    public IActionResult Verificar() => Ok(new { status = "ok", horario = DateTime.UtcNow });
}
