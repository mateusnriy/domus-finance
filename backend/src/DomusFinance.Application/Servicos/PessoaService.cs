using DomusFinance.Application.DTOs.Pessoas;
using DomusFinance.Application.Excecoes;
using DomusFinance.Application.Persistencia;
using DomusFinance.Domain.Entidades;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace DomusFinance.Application.Servicos;

public class PessoaService(IAppDbContext db, IValidator<SalvarPessoaRequest> validador)
{
    // Cadastra uma nova pessoa.
    public async Task<PessoaResponse> CriarAsync(SalvarPessoaRequest request, CancellationToken ct)
    {
        await validador.ValidateAndThrowAsync(request, ct);

        var pessoa = new Pessoa(request.Nome, request.Idade);
        db.Pessoas.Add(pessoa);
        await db.SaveChangesAsync(ct);

        return Mapear(pessoa, quantidadeTransacoes: 0);
    }

    // Lista todas as pessoas, ordenadas por nome, com a quantidade de transações de cada uma.
    public async Task<IReadOnlyList<PessoaResponse>> ListarAsync(CancellationToken ct)
    {
        var pessoas = await db.Pessoas
            .OrderBy(p => p.Nome)
            .Select(p => new { Pessoa = p, Quantidade = p.Transacoes.Count })
            .ToListAsync(ct);

        return pessoas.Select(p => Mapear(p.Pessoa, p.Quantidade)).ToList();
    }

    // Edita nome e idade de uma pessoa existente (RF18). 
    public async Task<PessoaResponse> EditarAsync(Guid id, SalvarPessoaRequest request, CancellationToken ct)
    {
        await validador.ValidateAndThrowAsync(request, ct);

        var pessoa = await db.Pessoas.FirstOrDefaultAsync(p => p.Id == id, ct)
            ?? throw new RecursoNaoEncontradoException("Pessoa não encontrada.");

        // Idade é reavaliada no ato; transações já registradas não são revalidadas.
        pessoa.Atualizar(request.Nome, request.Idade);
        await db.SaveChangesAsync(ct);

        var quantidadeTransacoes = await db.Transacoes.CountAsync(t => t.PessoaId == id, ct);
        return Mapear(pessoa, quantidadeTransacoes);
    }

    // Exclui a pessoa e, em cascata, todas as suas transações (RN05).
    public async Task ExcluirAsync(Guid id, CancellationToken ct)
    {
        var pessoa = await db.Pessoas.FirstOrDefaultAsync(p => p.Id == id, ct)
            ?? throw new RecursoNaoEncontradoException("Pessoa não encontrada.");

        db.Pessoas.Remove(pessoa);
        await db.SaveChangesAsync(ct);
    }

    private static PessoaResponse Mapear(Pessoa pessoa, int quantidadeTransacoes) =>
        new(pessoa.Id, pessoa.Nome, pessoa.Idade, pessoa.EhMenorDeIdade(), quantidadeTransacoes);
}
