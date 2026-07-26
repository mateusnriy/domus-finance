namespace DomusFinance.Application.Seguranca;

public interface IHasherDeSenha
{
    string GerarHash(string senha);
    bool Verificar(string senha, string hash);
}
