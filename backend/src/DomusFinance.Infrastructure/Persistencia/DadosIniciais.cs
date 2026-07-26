using DomusFinance.Domain.Entidades;
using DomusFinance.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace DomusFinance.Infrastructure.Persistencia;

public static class DadosIniciais
{
    // Popula o banco apenas quando vazio, para não duplicar a cada reinício.
    public static async Task AplicarAsync(AppDbContext contexto, CancellationToken ct = default)
    {
        if (await contexto.Pessoas.AnyAsync(ct))
            return;

        var hoje = DateOnly.FromDateTime(DateTime.UtcNow);

        var ana = new Pessoa("Ana Souza", 34);
        var carla = new Pessoa("Carla Nunes", 28);
        var diego = new Pessoa("Diego Alves", 16);

        contexto.Pessoas.AddRange(ana, carla, diego);

        contexto.Transacoes.AddRange(
            new Transacao("Salário", 4500.00m, TipoTransacao.Receita, hoje.AddDays(-21), null, ana.Id),
            new Transacao("Aluguel", 1500.00m, TipoTransacao.Despesa, hoje.AddDays(-16), CategoriaTransacao.Moradia, ana.Id),
            new Transacao("Supermercado", 820.50m, TipoTransacao.Despesa, hoje.AddDays(-34), CategoriaTransacao.Alimentacao, ana.Id),
            // Menor de idade com apenas despesa: saldo negativo, permitido pela RN03.
            new Transacao("Curso de inglês", 230.00m, TipoTransacao.Despesa, hoje.AddDays(-11), CategoriaTransacao.Educacao, diego.Id));

        // Carla permanece sem transações: os totais devem exibi-la zerada (RF06).
        await contexto.SaveChangesAsync(ct);
    }
}
