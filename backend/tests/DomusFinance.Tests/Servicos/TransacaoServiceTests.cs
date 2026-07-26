using DomusFinance.Application.DTOs.Transacoes;
using DomusFinance.Application.Excecoes;
using DomusFinance.Application.Servicos;
using DomusFinance.Application.Validacoes;
using DomusFinance.Domain.Entidades;
using DomusFinance.Domain.Enums;
using DomusFinance.Tests.Suporte;
using FluentAssertions;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace DomusFinance.Tests.Servicos;

public class TransacaoServiceTests
{
    private static readonly DateOnly Ontem = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(-1);

    private static TransacaoService CriarServico(DbContextFactory banco) =>
        new(banco.Contexto, new SalvarTransacaoRequestValidator());

    private static SalvarTransacaoRequest Pedido(
        Guid pessoaId,
        TipoTransacao tipo = TipoTransacao.Despesa,
        decimal valor = 100m,
        DateOnly? data = null,
        CategoriaTransacao? categoria = null) =>
        new("Lançamento", valor, tipo, data ?? Ontem, categoria, pessoaId);

    private static async Task<Pessoa> AdicionarPessoaAsync(DbContextFactory banco, string nome, int idade)
    {
        var pessoa = new Pessoa(nome, idade);
        banco.Contexto.Pessoas.Add(pessoa);
        await banco.Contexto.SaveChangesAsync();
        return pessoa;
    }

    [Fact]
    public async Task CriarAsync_DevePersistir_QuandoPessoaMaiorDeIdade()
    {
        using var banco = new DbContextFactory();
        var ana = await AdicionarPessoaAsync(banco, "Ana", 30);

        var resposta = await CriarServico(banco).CriarAsync(Pedido(ana.Id, TipoTransacao.Receita), default);

        resposta.Id.Should().NotBeEmpty();
        resposta.PessoaNome.Should().Be("Ana");
        resposta.Tipo.Should().Be("Receita");
    }

    [Fact]
    public async Task CriarAsync_DeveLancarRegraDeNegocio_QuandoMenorDeIdadeRegistraReceita()
    {
        using var banco = new DbContextFactory();
        var bruno = await AdicionarPessoaAsync(banco, "Bruno", 15);

        var acao = () => CriarServico(banco).CriarAsync(Pedido(bruno.Id, TipoTransacao.Receita), default);

        (await acao.Should().ThrowAsync<RegraDeNegocioException>())
            .WithMessage("Pessoas menores de 18 anos podem cadastrar apenas despesas.");
    }

    // A regra restringe o tipo, não bloqueia o menor de idade.
    [Fact]
    public async Task CriarAsync_DevePersistir_QuandoMenorDeIdadeRegistraDespesa()
    {
        using var banco = new DbContextFactory();
        var bruno = await AdicionarPessoaAsync(banco, "Bruno", 15);

        var resposta = await CriarServico(banco).CriarAsync(Pedido(bruno.Id, TipoTransacao.Despesa), default);

        resposta.Id.Should().NotBeEmpty();
        (await banco.Contexto.Transacoes.CountAsync()).Should().Be(1);
    }

    [Fact]
    public async Task CriarAsync_DeveLancarRecursoNaoEncontrado_QuandoPessoaNaoExiste()
    {
        using var banco = new DbContextFactory();

        var acao = () => CriarServico(banco).CriarAsync(Pedido(Guid.NewGuid()), default);

        (await acao.Should().ThrowAsync<RecursoNaoEncontradoException>())
            .WithMessage("Pessoa não encontrada.");
    }

    // Fixa a precedência: existência da pessoa antes da regra de maioridade.
    [Fact]
    public async Task CriarAsync_DeveLancarRecursoNaoEncontrado_QuandoPessoaNaoExisteERegistraReceita()
    {
        using var banco = new DbContextFactory();

        var acao = () => CriarServico(banco).CriarAsync(Pedido(Guid.NewGuid(), TipoTransacao.Receita), default);

        await acao.Should().ThrowAsync<RecursoNaoEncontradoException>();
    }

    [Fact]
    public async Task CriarAsync_DeveLancarValidacao_QuandoDataEFutura()
    {
        using var banco = new DbContextFactory();
        var ana = await AdicionarPessoaAsync(banco, "Ana", 30);
        var amanha = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1);

        var acao = () => CriarServico(banco).CriarAsync(Pedido(ana.Id, data: amanha), default);

        await acao.Should().ThrowAsync<ValidationException>();
    }

    [Fact]
    public async Task CriarAsync_DeveLancarValidacao_QuandoCategoriaForaDoEnum()
    {
        using var banco = new DbContextFactory();
        var ana = await AdicionarPessoaAsync(banco, "Ana", 30);

        var acao = () => CriarServico(banco)
            .CriarAsync(Pedido(ana.Id, categoria: (CategoriaTransacao)99), default);

        await acao.Should().ThrowAsync<ValidationException>();
    }

    [Fact]
    public async Task CriarAsync_DeveLancarValidacao_QuandoValorNaoEPositivo()
    {
        using var banco = new DbContextFactory();
        var ana = await AdicionarPessoaAsync(banco, "Ana", 30);

        var acao = () => CriarServico(banco).CriarAsync(Pedido(ana.Id, valor: -5m), default);

        await acao.Should().ThrowAsync<ValidationException>();
    }

    [Fact]
    public async Task ListarAsync_DeveFiltrarPorPessoaETipo_QuandoAmbosInformados()
    {
        using var banco = new DbContextFactory();
        var ana = await AdicionarPessoaAsync(banco, "Ana", 30);
        var bruno = await AdicionarPessoaAsync(banco, "Bruno", 40);
        banco.Contexto.Transacoes.AddRange(
            new Transacao("A", 10m, TipoTransacao.Despesa, Ontem, null, ana.Id),
            new Transacao("B", 20m, TipoTransacao.Receita, Ontem, null, ana.Id),
            new Transacao("C", 30m, TipoTransacao.Despesa, Ontem, null, bruno.Id));
        await banco.Contexto.SaveChangesAsync();

        var resultado = await CriarServico(banco)
            .ListarAsync(new FiltroTransacoes(ana.Id, TipoTransacao.Despesa, null, null, null), default);

        resultado.Should().ContainSingle().Which.Descricao.Should().Be("A");
    }

    [Fact]
    public async Task ListarAsync_DeveFiltrarPorCategoriaEPeriodo_QuandoAmbosInformados()
    {
        using var banco = new DbContextFactory();
        var ana = await AdicionarPessoaAsync(banco, "Ana", 30);
        banco.Contexto.Transacoes.AddRange(
            new Transacao("Dentro", 10m, TipoTransacao.Despesa, new DateOnly(2026, 7, 10), CategoriaTransacao.Moradia, ana.Id),
            new Transacao("ForaPeriodo", 20m, TipoTransacao.Despesa, new DateOnly(2026, 5, 10), CategoriaTransacao.Moradia, ana.Id),
            new Transacao("ForaCategoria", 30m, TipoTransacao.Despesa, new DateOnly(2026, 7, 12), CategoriaTransacao.Lazer, ana.Id));
        await banco.Contexto.SaveChangesAsync();

        var resultado = await CriarServico(banco).ListarAsync(
            new FiltroTransacoes(null, null, CategoriaTransacao.Moradia,
                new DateOnly(2026, 7, 1), new DateOnly(2026, 7, 31)), default);

        resultado.Should().ContainSingle().Which.Descricao.Should().Be("Dentro");
    }

    [Fact]
    public async Task EditarAsync_DeveLancarRegraDeNegocio_QuandoTornaReceitaDePessoaMenor()
    {
        using var banco = new DbContextFactory();
        var bruno = await AdicionarPessoaAsync(banco, "Bruno", 15);
        var transacao = new Transacao("Lanche", 25m, TipoTransacao.Despesa, Ontem, null, bruno.Id);
        banco.Contexto.Transacoes.Add(transacao);
        await banco.Contexto.SaveChangesAsync();

        var acao = () => CriarServico(banco)
            .EditarAsync(transacao.Id, Pedido(bruno.Id, TipoTransacao.Receita), default);

        (await acao.Should().ThrowAsync<RegraDeNegocioException>())
            .WithMessage("Pessoas menores de 18 anos podem cadastrar apenas despesas.");
    }

    [Fact]
    public async Task EditarAsync_DeveManterPessoaVinculada_QuandoRequisicaoInformaOutraPessoa()
    {
        using var banco = new DbContextFactory();
        var ana = await AdicionarPessoaAsync(banco, "Ana", 30);
        var bruno = await AdicionarPessoaAsync(banco, "Bruno", 40);
        var transacao = new Transacao("Original", 10m, TipoTransacao.Despesa, Ontem, null, ana.Id);
        banco.Contexto.Transacoes.Add(transacao);
        await banco.Contexto.SaveChangesAsync();

        var resposta = await CriarServico(banco).EditarAsync(transacao.Id, Pedido(bruno.Id), default);

        resposta.PessoaId.Should().Be(ana.Id);
        resposta.PessoaNome.Should().Be("Ana");
    }

    [Fact]
    public async Task ExcluirAsync_DeveRemoverApenasAInformada_QuandoHaOutrasTransacoes()
    {
        using var banco = new DbContextFactory();
        var ana = await AdicionarPessoaAsync(banco, "Ana", 30);
        var alvo = new Transacao("Alvo", 10m, TipoTransacao.Despesa, Ontem, null, ana.Id);
        banco.Contexto.Transacoes.AddRange(
            alvo, new Transacao("Outra", 20m, TipoTransacao.Despesa, Ontem, null, ana.Id));
        await banco.Contexto.SaveChangesAsync();

        await CriarServico(banco).ExcluirAsync(alvo.Id, default);

        var restantes = await banco.Contexto.Transacoes.ToListAsync();
        restantes.Should().ContainSingle().Which.Descricao.Should().Be("Outra");
    }

    [Fact]
    public async Task ExcluirAsync_DeveLancarRecursoNaoEncontrado_QuandoTransacaoNaoExiste()
    {
        using var banco = new DbContextFactory();

        var acao = () => CriarServico(banco).ExcluirAsync(Guid.NewGuid(), default);

        (await acao.Should().ThrowAsync<RecursoNaoEncontradoException>())
            .WithMessage("Transação não encontrada.");
    }
}
