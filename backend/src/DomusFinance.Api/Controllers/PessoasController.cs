using DomusFinance.Application.DTOs.Pessoas;
using DomusFinance.Application.Servicos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DomusFinance.Api.Controllers;

[ApiController]
[Route("api/pessoas")]
[Authorize]
public class PessoasController(PessoaService servico) : ControllerBase
{
    // Cadastra uma nova pessoa. 
    [HttpPost]
    public async Task<ActionResult<PessoaResponse>> Criar(SalvarPessoaRequest request, CancellationToken ct)
    {
        var pessoa = await servico.CriarAsync(request, ct);
        return Created($"/api/pessoas/{pessoa.Id}", pessoa);
    }

    // Lista todas as pessoas, com a quantidade de transações de cada uma. 
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PessoaResponse>>> Listar(CancellationToken ct)
        => Ok(await servico.ListarAsync(ct));

    // Edita nome e idade de uma pessoa existente. 
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PessoaResponse>> Editar(Guid id, SalvarPessoaRequest request, CancellationToken ct)
        => Ok(await servico.EditarAsync(id, request, ct));

    // Exclui a pessoa e, em cascata, todas as suas transações. 
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Excluir(Guid id, CancellationToken ct)
    {
        await servico.ExcluirAsync(id, ct);
        return NoContent();
    }
}
