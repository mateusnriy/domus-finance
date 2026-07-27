using DomusFinance.Application.DTOs.Pessoas;
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

public class PessoaServiceTests
{
    private static readonly DateOnly Data = new(2026, 7, 10);

    private static PessoaService CriarServico(DbContextFactory banco) =>
        new(banco.Contexto, new SalvarPessoaRequestValidator());

    [Fact]
    public async Task CriarAsync_DevePersistirComIdentificador_QuandoDadosValidos()
    {
        using var banco = new DbContextFactory();

        var resposta = await CriarServico(banco).CriarAsync(new SalvarPessoaRequest("Ana", 30), default);

        resposta.Id.Should().NotBeEmpty();
        resposta.QuantidadeTransacoes.Should().Be(0);
        (await banco.Contexto.Pessoas.CountAsync()).Should().Be(1);
    }

    [Fact]
    public async Task CriarAsync_DeveLancarValidacao_QuandoIdadeForaDoIntervalo()
    {
        using var banco = new DbContextFactory();

        var acao = () => CriarServico(banco).CriarAsync(new SalvarPessoaRequest("Ana", 131), default);

        await acao.Should().ThrowAsync<ValidationException>();
    }

    [Fact]
    public async Task ListarAsync_DeveOrdenarPorNome_QuandoHaVariasPessoas()
    {
        using var banco = new DbContextFactory();
        banco.Contexto.Pessoas.AddRange(new Pessoa("Carla", 28), new Pessoa("Ana", 30), new Pessoa("Bruno", 40));
        await banco.Contexto.SaveChangesAsync();

        var pessoas = await CriarServico(banco).ListarAsync(default);

        pessoas.Select(p => p.Nome).Should().Equal("Ana", "Bruno", "Carla");
    }

    [Fact]
    public async Task ListarAsync_DeveTrazerQuantidadeCorretaPorPessoa_QuandoHaTransacoes()
    {
        using var banco = new DbContextFactory();
        var ana = new Pessoa("Ana", 30);
        var carla = new Pessoa("Carla", 28);
        banco.Contexto.Pessoas.AddRange(ana, carla);
        banco.Contexto.Transacoes.AddRange(
            new Transacao("A", 10m, TipoTransacao.Despesa, Data, null, ana.Id),
            new Transacao("B", 20m, TipoTransacao.Despesa, Data, null, ana.Id));
        await banco.Contexto.SaveChangesAsync();

        var pessoas = await CriarServico(banco).ListarAsync(default);

        pessoas.Single(p => p.Nome == "Ana").QuantidadeTransacoes.Should().Be(2);
        pessoas.Single(p => p.Nome == "Carla").QuantidadeTransacoes.Should().Be(0);
    }

    // Confiar na configuração de cascata sem testá-la é o erro clássico aqui.
    [Fact]
    public async Task ExcluirAsync_DeveRemoverPessoaETransacoes_QuandoPessoaTemTresTransacoes()
    {
        using var banco = new DbContextFactory();
        var ana = new Pessoa("Ana", 30);
        banco.Contexto.Pessoas.Add(ana);
        banco.Contexto.Transacoes.AddRange(
            new Transacao("A", 10m, TipoTransacao.Despesa, Data, null, ana.Id),
            new Transacao("B", 20m, TipoTransacao.Despesa, Data, null, ana.Id),
            new Transacao("C", 30m, TipoTransacao.Despesa, Data, null, ana.Id));
        await banco.Contexto.SaveChangesAsync();

        await CriarServico(banco).ExcluirAsync(ana.Id, default);

        (await banco.Contexto.Pessoas.CountAsync()).Should().Be(0);
        (await banco.Contexto.Transacoes.CountAsync()).Should().Be(0);
    }

    [Fact]
    public async Task ExcluirAsync_DeveLancarRecursoNaoEncontrado_QuandoPessoaNaoExiste()
    {
        using var banco = new DbContextFactory();

        var acao = () => CriarServico(banco).ExcluirAsync(Guid.NewGuid(), default);

        (await acao.Should().ThrowAsync<RecursoNaoEncontradoException>())
            .WithMessage("Pessoa não encontrada.");
    }

    [Fact]
    public async Task EditarAsync_DevePersistirNomeEIdade_QuandoPessoaExiste()
    {
        using var banco = new DbContextFactory();
        var ana = new Pessoa("Ana", 30);
        banco.Contexto.Pessoas.Add(ana);
        await banco.Contexto.SaveChangesAsync();

        var resposta = await CriarServico(banco).EditarAsync(ana.Id, new SalvarPessoaRequest("Ana Souza", 31), default);

        resposta.Nome.Should().Be("Ana Souza");
        resposta.Idade.Should().Be(31);
    }

    [Fact]
    public async Task EditarAsync_DeveLancarValidacao_QuandoIdadeForaDoIntervalo()
    {
        using var banco = new DbContextFactory();
        var ana = new Pessoa("Ana", 30);
        banco.Contexto.Pessoas.Add(ana);
        await banco.Contexto.SaveChangesAsync();

        var acao = () => CriarServico(banco).EditarAsync(ana.Id, new SalvarPessoaRequest("Ana", -1), default);

        await acao.Should().ThrowAsync<ValidationException>();
    }

    // RN21: a maioridade vale no ato do registro; baixar a idade não apaga histórico.
    [Fact]
    public async Task EditarAsync_DeveManterTransacoesExistentes_QuandoAdultoPassaAMenor()
    {
        using var banco = new DbContextFactory();
        var ana = new Pessoa("Ana", 30);
        banco.Contexto.Pessoas.Add(ana);
        banco.Contexto.Transacoes.Add(
            new Transacao("Salário", 1000m, TipoTransacao.Receita, Data, null, ana.Id));
        await banco.Contexto.SaveChangesAsync();

        var resposta = await CriarServico(banco).EditarAsync(ana.Id, new SalvarPessoaRequest("Ana", 15), default);

        resposta.MenorDeIdade.Should().BeTrue();
        (await banco.Contexto.Transacoes.CountAsync(t => t.PessoaId == ana.Id)).Should().Be(1);
    }

    [Fact]
    public async Task EditarAsync_DeveLancarRecursoNaoEncontrado_QuandoPessoaNaoExiste()
    {
        using var banco = new DbContextFactory();

        var acao = () => CriarServico(banco).EditarAsync(Guid.NewGuid(), new SalvarPessoaRequest("Ana", 30), default);

        (await acao.Should().ThrowAsync<RecursoNaoEncontradoException>())
            .WithMessage("Pessoa não encontrada.");
    }
}
