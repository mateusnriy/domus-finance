namespace DomusFinance.Domain.Entidades;

// Operador do sistema. Não possui vínculo com Pessoa. 
public class Usuario
{
    public const int TamanhoMinimoSenha = 8;

    private Usuario() { }

    public Usuario(string nome, string email, string senhaHash)
    {
        Id = Guid.NewGuid();
        Nome = nome.Trim();
        Email = NormalizarEmail(email);
        SenhaHash = senhaHash;
        CriadoEm = DateTime.UtcNow;
    }

    public Guid Id { get; private set; }
    public string Nome { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;

    // Hash BCrypt. nunca recebe nem expõe senha em texto puro. 
    public string SenhaHash { get; private set; } = string.Empty;

    public DateTime CriadoEm { get; private set; }

    // normalização única para registro e login, evitando divergência entre os dois.
    public static string NormalizarEmail(string email) => email.Trim().ToLowerInvariant();
}
