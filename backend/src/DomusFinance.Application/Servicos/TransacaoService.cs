using DomusFinance.Application.DTOs.Transacoes;
using DomusFinance.Application.Excecoes;
using DomusFinance.Application.Persistencia;
using DomusFinance.Domain.Entidades;
using DomusFinance.Domain.Enums;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace DomusFinance.Application.Servicos;

public class TransacaoService(IAppDbContext db, IValidator<SalvarTransacaoRequest> validador)
{
    private const string MensagemMenorDeIdade = "Pessoas menores de 18 anos podem cadastrar apenas despesas.";

    // Registra uma transação para uma pessoa existente.
    public async Task<TransacaoResponse> CriarAsync(SalvarTransacaoRequest request, CancellationToken ct)
    {
        await validador.ValidateAndThrowAsync(request, ct);

        var pessoa = await db.Pessoas.FirstOrDefaultAsync(p => p.Id == request.PessoaId, ct)
            ?? throw new RecursoNaoEncontradoException("Pessoa não encontrada.");

        GarantirTipoPermitido(pessoa, request.Tipo);

        var transacao = new Transacao(
            request.Descricao, request.Valor, request.Tipo,
            request.Data, request.Categoria, pessoa.Id);

        db.Transacoes.Add(transacao);
        await db.SaveChangesAsync(ct);

        return Mapear(transacao, pessoa.Nome);
    }

    // Edita a transação revalidando todas as regras da criação (RN20).
    public async Task<TransacaoResponse> EditarAsync(Guid id, SalvarTransacaoRequest request, CancellationToken ct)
    {
        await validador.ValidateAndThrowAsync(request, ct);

        var transacao = await db.Transacoes
            .Include(t => t.Pessoa)
            .FirstOrDefaultAsync(t => t.Id == id, ct)
            ?? throw new RecursoNaoEncontradoException("Transação não encontrada.");

        // A pessoa vinculada não muda: PessoaId do request é ignorado (RF19).
        var pessoa = transacao.Pessoa!;
        GarantirTipoPermitido(pessoa, request.Tipo);

        transacao.Atualizar(request.Descricao, request.Valor, request.Tipo, request.Data, request.Categoria);
        await db.SaveChangesAsync(ct);

        return Mapear(transacao, pessoa.Nome);
    }

    // Exclui uma transação individual, sem afetar as demais.
    public async Task ExcluirAsync(Guid id, CancellationToken ct)
    {
        var transacao = await db.Transacoes.FirstOrDefaultAsync(t => t.Id == id, ct)
            ?? throw new RecursoNaoEncontradoException("Transação não encontrada.");

        db.Transacoes.Remove(transacao);
        await db.SaveChangesAsync(ct);
    }

    // Lista aplicando os filtros informados; os omitidos não restringem o resultado.
    public async Task<IReadOnlyList<TransacaoResponse>> ListarAsync(FiltroTransacoes filtro, CancellationToken ct)
    {
        var consulta = db.Transacoes.AsQueryable();

        if (filtro.PessoaId.HasValue)
            consulta = consulta.Where(t => t.PessoaId == filtro.PessoaId.Value);

        if (filtro.Tipo.HasValue)
            consulta = consulta.Where(t => t.Tipo == filtro.Tipo.Value);

        if (filtro.Categoria.HasValue)
            consulta = consulta.Where(t => t.Categoria == filtro.Categoria.Value);

        if (filtro.DataInicio.HasValue)
            consulta = consulta.Where(t => t.Data >= filtro.DataInicio.Value);

        if (filtro.DataFim.HasValue)
            consulta = consulta.Where(t => t.Data <= filtro.DataFim.Value);

        var registros = await consulta
            .OrderByDescending(t => t.Data)
            .ThenByDescending(t => t.CriadoEm)
            .Select(t => new
            {
                t.Id,
                t.Descricao,
                t.Valor,
                t.Tipo,
                t.Data,
                t.Categoria,
                t.PessoaId,
                PessoaNome = t.Pessoa!.Nome
            })
            .ToListAsync(ct);

        return registros.Select(r => new TransacaoResponse(
            r.Id, r.Descricao, r.Valor, r.Tipo.ToString(), r.Data,
            r.Categoria?.ToString(), r.PessoaId, r.PessoaNome)).ToList();
    }

    // RN03: a regra restringe o tipo, não bloqueia o menor de idade.
    private static void GarantirTipoPermitido(Pessoa pessoa, TipoTransacao tipo)
    {
        if (pessoa.EhMenorDeIdade() && tipo == TipoTransacao.Receita)
            throw new RegraDeNegocioException(MensagemMenorDeIdade);
    }

    private static TransacaoResponse Mapear(Transacao transacao, string pessoaNome) =>
        new(transacao.Id, transacao.Descricao, transacao.Valor, transacao.Tipo.ToString(),
            transacao.Data, transacao.Categoria?.ToString(), transacao.PessoaId, pessoaNome);
}
