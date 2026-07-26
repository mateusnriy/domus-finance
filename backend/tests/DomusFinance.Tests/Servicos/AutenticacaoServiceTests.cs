using DomusFinance.Application.DTOs.Auth;
using DomusFinance.Application.Excecoes;
using DomusFinance.Application.Seguranca;
using DomusFinance.Application.Servicos;
using DomusFinance.Application.Validacoes;
using DomusFinance.Domain.Entidades;
using DomusFinance.Infrastructure.Seguranca;
using DomusFinance.Tests.Suporte;
using FluentAssertions;

namespace DomusFinance.Tests.Servicos;

public class AutenticacaoServiceTests
{
    private static readonly ConfiguracaoJwt Configuracao = new()
    {
        Chave = "chave-de-teste-com-mais-de-32-caracteres",
        Emissor = "DomusFinance",
        Audiencia = "DomusFinanceApp",
        HorasDeValidade = 8
    };

    private static AutenticacaoService CriarServico(DbContextFactory banco, IHasherDeSenha? hasher = null) =>
        new(banco.Contexto,
            hasher ?? new HasherFake(),
            new GeradorDeTokenJwt(Configuracao),
            new RegistrarUsuarioRequestValidator(),
            new LoginRequestValidator());

    [Fact]
    public async Task RegistrarAsync_DeveArmazenarHashDiferenteDaSenha_QuandoDadosValidos()
    {
        using var banco = new DbContextFactory();

        var resposta = await CriarServico(banco)
            .RegistrarAsync(new RegistrarUsuarioRequest("Maria", "maria@exemplo.com", "Senha@1234"), default);

        resposta.Id.Should().NotBeEmpty();
        var persistido = banco.Contexto.Usuarios.Single();
        persistido.SenhaHash.Should().NotBe("Senha@1234");
    }

    [Fact]
    public async Task RegistrarAsync_DeveLancarConflito_QuandoEmailJaExiste()
    {
        using var banco = new DbContextFactory();
        var servico = CriarServico(banco);
        await servico.RegistrarAsync(new RegistrarUsuarioRequest("Maria", "maria@exemplo.com", "Senha@1234"), default);

        var acao = () => servico.RegistrarAsync(
            new RegistrarUsuarioRequest("Outra", "MARIA@Exemplo.COM", "Senha@1234"), default);

        await acao.Should().ThrowAsync<ConflitoException>();
    }

    [Fact]
    public async Task AutenticarAsync_DeveAutenticar_QuandoRegistradoComMaiusculasELoginComMinusculas()
    {
        using var banco = new DbContextFactory();
        var servico = CriarServico(banco);
        await servico.RegistrarAsync(new RegistrarUsuarioRequest("Maria", "  Maria@Exemplo.COM ", "Senha@1234"), default);

        var resposta = await servico.AutenticarAsync(new LoginRequest("maria@exemplo.com", "Senha@1234"), default);

        resposta.Token.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task AutenticarAsync_DeveDevolverTokenExpirandoEmOitoHoras_QuandoCredenciaisValidas()
    {
        using var banco = new DbContextFactory();
        var servico = CriarServico(banco);
        await servico.RegistrarAsync(new RegistrarUsuarioRequest("Maria", "maria@exemplo.com", "Senha@1234"), default);

        var resposta = await servico.AutenticarAsync(new LoginRequest("maria@exemplo.com", "Senha@1234"), default);

        resposta.Token.Should().NotBeNullOrWhiteSpace();
        resposta.ExpiraEm.Should().BeCloseTo(DateTime.UtcNow.AddHours(8), TimeSpan.FromMinutes(1));
    }

    // Este teste e o seguinte formam o par da RN13: as mensagens devem ser idênticas.
    [Fact]
    public async Task AutenticarAsync_DeveLancarNaoAutorizadoComMensagemGenerica_QuandoSenhaIncorreta()
    {
        using var banco = new DbContextFactory();
        var servico = CriarServico(banco);
        await servico.RegistrarAsync(new RegistrarUsuarioRequest("Maria", "maria@exemplo.com", "Senha@1234"), default);

        var acao = () => servico.AutenticarAsync(new LoginRequest("maria@exemplo.com", "SenhaErrada1"), default);

        (await acao.Should().ThrowAsync<NaoAutorizadoException>())
            .WithMessage("E-mail ou senha inválidos.");
    }

    [Fact]
    public async Task AutenticarAsync_DeveLancarNaoAutorizadoComMensagemGenerica_QuandoEmailInexistente()
    {
        using var banco = new DbContextFactory();

        var acao = () => CriarServico(banco)
            .AutenticarAsync(new LoginRequest("ninguem@exemplo.com", "SenhaErrada1"), default);

        (await acao.Should().ThrowAsync<NaoAutorizadoException>())
            .WithMessage("E-mail ou senha inválidos.");
    }

    [Fact]
    public async Task ObterPerfilAsync_DeveLancarRecursoNaoEncontrado_QuandoIdentificadorInexistente()
    {
        using var banco = new DbContextFactory();

        var acao = () => CriarServico(banco).ObterPerfilAsync(Guid.NewGuid(), default);

        await acao.Should().ThrowAsync<RecursoNaoEncontradoException>();
    }

    [Fact]
    public async Task RegistrarAsync_DeveGerarHashVerificavelPeloBCrypt_QuandoUsaImplementacaoReal()
    {
        using var banco = new DbContextFactory();
        var hasher = new HasherDeSenhaBCrypt();
        var servico = CriarServico(banco, hasher);

        await servico.RegistrarAsync(new RegistrarUsuarioRequest("Maria", "maria@exemplo.com", "Senha@1234"), default);

        var persistido = banco.Contexto.Usuarios.Single();
        persistido.SenhaHash.Should().StartWith("$2");
        hasher.Verificar("Senha@1234", persistido.SenhaHash).Should().BeTrue();
        hasher.Verificar("SenhaErrada", persistido.SenhaHash).Should().BeFalse();
    }
}
