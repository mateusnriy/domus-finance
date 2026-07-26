using DomusFinance.Domain.Entidades;
using FluentAssertions;

namespace DomusFinance.Tests.Dominio;

public class PessoaTests
{
    [Fact]
    public void EhMenorDeIdade_DeveSerVerdadeiro_QuandoIdadeEDezessete()
    {
        new Pessoa("Bruno", 17).EhMenorDeIdade().Should().BeTrue();
    }

    // Limite exato: erros de fronteira são o tipo de falha que passa despercebida.
    [Fact]
    public void EhMenorDeIdade_DeveSerFalso_QuandoIdadeEDezoito()
    {
        new Pessoa("Ana", 18).EhMenorDeIdade().Should().BeFalse();
    }

    [Fact]
    public void Construtor_DeveAparaEspacosDoNome_QuandoInformadoComSobra()
    {
        new Pessoa("  Ana Souza  ", 30).Nome.Should().Be("Ana Souza");
    }

    [Fact]
    public void Atualizar_DeveAlterarNomeEIdade_QuandoInvocado()
    {
        var pessoa = new Pessoa("Ana", 30);

        pessoa.Atualizar("  Ana Souza  ", 31);

        pessoa.Nome.Should().Be("Ana Souza");
        pessoa.Idade.Should().Be(31);
    }
}
