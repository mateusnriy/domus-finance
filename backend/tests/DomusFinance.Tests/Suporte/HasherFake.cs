using DomusFinance.Application.Seguranca;

namespace DomusFinance.Tests.Suporte;

// Evita o custo do BCrypt nos testes que não são sobre hash.
public class HasherFake : IHasherDeSenha
{
    public string GerarHash(string senha) => $"hash::{senha}";

    public bool Verificar(string senha, string hash) => hash == GerarHash(senha);
}
