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
        //
        // A soma é feita em memória, e não no banco: o provider do SQLite usado
        // nos testes recusa agregação sobre decimal. Somar em C# roda igual nos
        // dois bancos e mantém a aritmética decimal exata.
        var linhas = await db.Pessoas
            .OrderBy(p => p.Nome)
            .Select(p => new
            {
                p.Id,
                p.Nome,
                p.Idade,
                Lancamentos = p.Transacoes.Select(t => new { t.Tipo, t.Valor }).ToList()
            })
            .ToListAsync(ct);

        var pessoas = linhas
            .Select(l =>
            {
                var receitas = l.Lancamentos.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor);
                var despesas = l.Lancamentos.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor);
                return new ResumoPessoaResponse(l.Id, l.Nome, l.Idade, receitas, despesas, receitas - despesas);
            })
            .ToList();

        // RN08: o total geral é a soma das linhas, garantindo que as duas visões batam.
        var totalReceitas = pessoas.Sum(p => p.TotalReceitas);
        var totalDespesas = pessoas.Sum(p => p.TotalDespesas);

        var despesas = await db.Transacoes
            .Where(t => t.Tipo == TipoTransacao.Despesa)
            .Select(t => new { t.Categoria, t.Valor })
            .ToListAsync(ct);

        var despesasPorCategoria = despesas
            .GroupBy(t => t.Categoria)
            .Select(g => new ResumoCategoriaResponse(g.Key?.ToString() ?? SemCategoria, g.Sum(t => t.Valor)))
            .OrderByDescending(c => c.Total)
            .ToList();

        return new ResumoGeralResponse(
            pessoas, totalReceitas, totalDespesas, totalReceitas - totalDespesas, despesasPorCategoria);
    }
}
