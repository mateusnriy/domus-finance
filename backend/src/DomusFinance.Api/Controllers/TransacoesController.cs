using DomusFinance.Application.DTOs.Transacoes;
using DomusFinance.Application.Servicos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DomusFinance.Api.Controllers;

[ApiController]
[Route("api/transacoes")]
[Authorize]
public class TransacoesController(TransacaoService servico) : ControllerBase
{
    // Registra uma transação para uma pessoa existente.
    [HttpPost]
    public async Task<ActionResult<TransacaoResponse>> Criar(SalvarTransacaoRequest request, CancellationToken ct)
    {
        var transacao = await servico.CriarAsync(request, ct);
        return Created($"/api/transacoes/{transacao.Id}", transacao);
    }

    // Lista as transações, aplicando os filtros informados na consulta.
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<TransacaoResponse>>> Listar(
        [FromQuery] FiltroTransacoes filtro, CancellationToken ct)
        => Ok(await servico.ListarAsync(filtro, ct));

    // Edita a transação; a pessoa vinculada não muda.
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TransacaoResponse>> Editar(Guid id, SalvarTransacaoRequest request, CancellationToken ct)
        => Ok(await servico.EditarAsync(id, request, ct));

    // Exclui uma transação individual.
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Excluir(Guid id, CancellationToken ct)
    {
        await servico.ExcluirAsync(id, ct);
        return NoContent();
    }
}
