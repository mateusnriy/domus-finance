using DomusFinance.Application.Seguranca;

namespace DomusFinance.Infrastructure.Seguranca;

public class HasherDeSenhaBCrypt : IHasherDeSenha
{
    // Fator 11: equilíbrio entre custo para o atacante e tempo de resposta no login.
    private const int FatorDeTrabalho = 11;

    // BCrypt gera e embute o salt automaticamente; não há salt separado a armazenar.
    public string GerarHash(string senha) =>
        BCrypt.Net.BCrypt.HashPassword(senha, FatorDeTrabalho);

    public bool Verificar(string senha, string hash) =>
        BCrypt.Net.BCrypt.Verify(senha, hash);
}
