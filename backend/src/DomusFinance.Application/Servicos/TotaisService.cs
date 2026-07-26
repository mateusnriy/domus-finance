using DomusFinance.Application.DTOs.Totais;
using DomusFinance.Application.Persistencia;
using DomusFinance.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace DomusFinance.Application.Servicos;

public class TotaisService(IAppDbContext db)
{
    private const string SemCategoria = "Sem categoria";

    // Consolida receitas, despesas e saldo por pessoa e no geral.
    public async Task<ResumoGeralResponse> ObterAsync(CancellationToken ct)
    {
        // Projetado a partir de Pessoas, não de Transacoes: quem não tem
        // lançamento precisa aparecer zerado em vez de sumir do resultado.
        var linhas = await db.Pessoas
            .OrderBy(p => p.Nome)
            .Select(p => new
            {
                p.Id,
                p.Nome,
                p.Idade,
                // Cast para nullable: Sum em coleção vazia lançaria exceção.
                Receitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => (decimal?)t.Valor) ?? 0m,
                Despesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => (decimal?)t.Valor) ?? 0m
            })
            .ToListAsync(ct);

        var pessoas = linhas
            .Select(l => new ResumoPessoaResponse(
                l.Id, l.Nome, l.Idade, l.Receitas, l.Despesas, l.Receitas - l.Despesas))
            .ToList();

        // RN08: o total geral é a soma das linhas, garantindo que as duas visões batam.
        var totalReceitas = pessoas.Sum(p => p.TotalReceitas);
        var totalDespesas = pessoas.Sum(p => p.TotalDespesas);

        var agrupadas = await db.Transacoes
            .Where(t => t.Tipo == TipoTransacao.Despesa)
            .GroupBy(t => t.Categoria)
            .Select(g => new { Categoria = g.Key, Total = g.Sum(t => t.Valor) })
            .ToListAsync(ct);

        var despesasPorCategoria = agrupadas
            .Select(c => new ResumoCategoriaResponse(c.Categoria?.ToString() ?? SemCategoria, c.Total))
            .OrderByDescending(c => c.Total)
            .ToList();

        return new ResumoGeralResponse(
            pessoas, totalReceitas, totalDespesas, totalReceitas - totalDespesas, despesasPorCategoria);
    }
}
