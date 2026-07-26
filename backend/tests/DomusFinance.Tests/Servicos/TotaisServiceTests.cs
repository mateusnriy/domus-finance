using DomusFinance.Application.Servicos;
using DomusFinance.Domain.Entidades;
using DomusFinance.Domain.Enums;
using DomusFinance.Tests.Suporte;
using FluentAssertions;

namespace DomusFinance.Tests.Servicos;

public class TotaisServiceTests
{
    private static readonly DateOnly Data = new(2026, 7, 10);

    private static TotaisService CriarServico(DbContextFactory banco) => new(banco.Contexto);

    [Fact]
    public async Task ObterAsync_DeveCalcularSaldoComoReceitasMenosDespesas_QuandoPessoaTemAmbos()
    {
        using var banco = new DbContextFactory();
        var ana = new Pessoa("Ana", 30);
        banco.Contexto.Pessoas.Add(ana);
        banco.Contexto.Transacoes.AddRange(
            new Transacao("Salário", 3000m, TipoTransacao.Receita, Data, null, ana.Id),
            new Transacao("Aluguel", 1200m, TipoTransacao.Despesa, Data, CategoriaTransacao.Moradia, ana.Id));
        await banco.Contexto.SaveChangesAsync();

        var resumo = await CriarServico(banco).ObterAsync(default);

        var linha = resumo.Pessoas.Single();
        linha.TotalReceitas.Should().Be(3000m);
        linha.TotalDespesas.Should().Be(1200m);
        linha.Saldo.Should().Be(1800m);
    }

    [Fact]
    public async Task ObterAsync_DeveIncluirPessoaZerada_QuandoNaoTemTransacoes()
    {
        using var banco = new DbContextFactory();
        banco.Contexto.Pessoas.Add(new Pessoa("Carla", 28));
        await banco.Contexto.SaveChangesAsync();

        var resumo = await CriarServico(banco).ObterAsync(default);

        var linha = resumo.Pessoas.Should().ContainSingle(p => p.Nome == "Carla").Subject;
        linha.TotalReceitas.Should().Be(0m);
        linha.TotalDespesas.Should().Be(0m);
        linha.Saldo.Should().Be(0m);
    }

    [Fact]
    public async Task ObterAsync_DeveApresentarSaldoNegativo_QuandoPessoaSoTemDespesas()
    {
        using var banco = new DbContextFactory();
        var diego = new Pessoa("Diego", 16);
        banco.Contexto.Pessoas.Add(diego);
        banco.Contexto.Transacoes.Add(
            new Transacao("Curso", 230m, TipoTransacao.Despesa, Data, CategoriaTransacao.Educacao, diego.Id));
        await banco.Contexto.SaveChangesAsync();

        var resumo = await CriarServico(banco).ObterAsync(default);

        resumo.Pessoas.Single().Saldo.Should().Be(-230m);
    }

    [Fact]
    public async Task ObterAsync_DeveIgualarTotalGeralASomaDasLinhas_QuandoHaVariasPessoas()
    {
        using var banco = new DbContextFactory();
        var ana = new Pessoa("Ana", 30);
        var bruno = new Pessoa("Bruno", 40);
        banco.Contexto.Pessoas.AddRange(ana, bruno);
        banco.Contexto.Transacoes.AddRange(
            new Transacao("Salário", 3000m, TipoTransacao.Receita, Data, null, ana.Id),
            new Transacao("Aluguel", 1200m, TipoTransacao.Despesa, Data, CategoriaTransacao.Moradia, ana.Id),
            new Transacao("Freela", 800m, TipoTransacao.Receita, Data, null, bruno.Id),
            new Transacao("Mercado", 150m, TipoTransacao.Despesa, Data, CategoriaTransacao.Alimentacao, bruno.Id));
        await banco.Contexto.SaveChangesAsync();

        var resumo = await CriarServico(banco).ObterAsync(default);

        resumo.TotalReceitas.Should().Be(resumo.Pessoas.Sum(p => p.TotalReceitas));
        resumo.TotalDespesas.Should().Be(resumo.Pessoas.Sum(p => p.TotalDespesas));
        resumo.SaldoLiquido.Should().Be(resumo.TotalReceitas - resumo.TotalDespesas);
    }

    [Fact]
    public async Task ObterAsync_DeveSomarCentavosSemErro_QuandoValoresTemCasasDecimais()
    {
        using var banco = new DbContextFactory();
        var ana = new Pessoa("Ana", 30);
        banco.Contexto.Pessoas.Add(ana);
        banco.Contexto.Transacoes.AddRange(
            new Transacao("A", 0.10m, TipoTransacao.Despesa, Data, CategoriaTransacao.Outros, ana.Id),
            new Transacao("B", 0.20m, TipoTransacao.Despesa, Data, CategoriaTransacao.Outros, ana.Id));
        await banco.Contexto.SaveChangesAsync();

        var resumo = await CriarServico(banco).ObterAsync(default);

        // Em ponto flutuante 0,10 + 0,20 produziria 0,30000000000000004.
        resumo.TotalDespesas.Should().Be(0.30m);
    }

    [Fact]
    public async Task ObterAsync_DeveAgruparDespesasPorCategoria_ETratarNulaComoSemCategoria()
    {
        using var banco = new DbContextFactory();
        var ana = new Pessoa("Ana", 30);
        banco.Contexto.Pessoas.Add(ana);
        banco.Contexto.Transacoes.AddRange(
            new Transacao("Aluguel", 1000m, TipoTransacao.Despesa, Data, CategoriaTransacao.Moradia, ana.Id),
            new Transacao("Mercado", 300m, TipoTransacao.Despesa, Data, CategoriaTransacao.Alimentacao, ana.Id),
            new Transacao("Avulso", 50m, TipoTransacao.Despesa, Data, null, ana.Id),
            new Transacao("Salário", 5000m, TipoTransacao.Receita, Data, null, ana.Id));
        await banco.Contexto.SaveChangesAsync();

        var resumo = await CriarServico(banco).ObterAsync(default);

        resumo.DespesasPorCategoria.Select(c => c.Categoria)
            .Should().Equal("Moradia", "Alimentacao", "Sem categoria");
        resumo.DespesasPorCategoria.Single(c => c.Categoria == "Sem categoria").Total.Should().Be(50m);
        // A receita não entra no resumo de despesas.
        resumo.DespesasPorCategoria.Should().HaveCount(3);
    }
}
