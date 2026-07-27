using DomusFinance.Application.DTOs.Totais;
using DomusFinance.Application.Servicos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DomusFinance.Api.Controllers;

[ApiController]
[Route("api/totais")]
[Authorize]
public class TotaisController(TotaisService servico) : ControllerBase
{
    // Consolida os totais por pessoa, o geral e as despesas por categoria.
    [HttpGet]
    public async Task<ActionResult<ResumoGeralResponse>> Obter(CancellationToken ct)
        => Ok(await servico.ObterAsync(ct));
}
