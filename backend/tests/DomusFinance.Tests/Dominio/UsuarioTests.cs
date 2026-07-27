using DomusFinance.Domain.Entidades;
using FluentAssertions;

namespace DomusFinance.Tests.Dominio;

public class UsuarioTests
{
    [Fact]
    public void NormalizarEmail_DeveAparaEConverterParaMinusculas_QuandoRecebeEspacosEMaiusculas()
    {
        Usuario.NormalizarEmail("  Maria@Exemplo.COM ").Should().Be("maria@exemplo.com");
    }

    [Fact]
    public void Construtor_DeveArmazenarEmailNormalizado_QuandoInformadoComMaiusculas()
    {
        new Usuario("Maria", "  Maria@Exemplo.COM ", "hash").Email.Should().Be("maria@exemplo.com");
    }
}
