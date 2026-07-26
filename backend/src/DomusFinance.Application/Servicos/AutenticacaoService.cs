using DomusFinance.Application.DTOs.Auth;
using DomusFinance.Application.Excecoes;
using DomusFinance.Application.Persistencia;
using DomusFinance.Application.Seguranca;
using DomusFinance.Domain.Entidades;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace DomusFinance.Application.Servicos;

public class AutenticacaoService(
    IAppDbContext db,
    IHasherDeSenha hasher,
    IGeradorDeToken geradorDeToken,
    IValidator<RegistrarUsuarioRequest> validadorDeRegistro,
    IValidator<LoginRequest> validadorDeLogin)
{
    // RN13: e-mail inexistente e senha incorreta são indistinguíveis.
    private const string CredenciaisInvalidas = "E-mail ou senha inválidos.";

    // Hash descartável para igualar o tempo de resposta quando o e-mail não existe.
    // Calculado uma vez por processo: sem ele, e-mail inexistente responde em
    // poucos milissegundos e e-mail existente em cerca de cem, diferença mensurável
    // que revela exatamente a informação que a RN13 protege.
    private static string? _hashParaComparacao;

    // Cria a conta de acesso; o e-mail é único no sistema.
    public async Task<UsuarioResponse> RegistrarAsync(RegistrarUsuarioRequest request, CancellationToken ct)
    {
        await validadorDeRegistro.ValidateAndThrowAsync(request, ct);

        var email = Usuario.NormalizarEmail(request.Email);
        if (await db.Usuarios.AnyAsync(u => u.Email == email, ct))
            throw new ConflitoException("E-mail já cadastrado.");

        var usuario = new Usuario(request.Nome, request.Email, hasher.GerarHash(request.Senha));
        db.Usuarios.Add(usuario);
        await db.SaveChangesAsync(ct);

        return Mapear(usuario);
    }

    // Valida as credenciais e devolve o token de acesso.
    public async Task<LoginResponse> AutenticarAsync(LoginRequest request, CancellationToken ct)
    {
        await validadorDeLogin.ValidateAndThrowAsync(request, ct);

        var email = Usuario.NormalizarEmail(request.Email);
        var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.Email == email, ct);

        if (usuario is null)
        {
            hasher.Verificar(request.Senha, ObterHashParaComparacao());
            throw new NaoAutorizadoException(CredenciaisInvalidas);
        }

        if (!hasher.Verificar(request.Senha, usuario.SenhaHash))
            throw new NaoAutorizadoException(CredenciaisInvalidas);

        var (token, expiraEm) = geradorDeToken.Gerar(usuario);
        return new LoginResponse(token, expiraEm, Mapear(usuario));
    }

    // Devolve os dados do usuário da sessão corrente.
    public async Task<UsuarioResponse> ObterPerfilAsync(Guid id, CancellationToken ct)
    {
        var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.Id == id, ct)
            ?? throw new RecursoNaoEncontradoException("Usuário não encontrado.");

        return Mapear(usuario);
    }

    private string ObterHashParaComparacao() =>
        _hashParaComparacao ??= hasher.GerarHash(Guid.NewGuid().ToString());

    private static UsuarioResponse Mapear(Usuario usuario) =>
        new(usuario.Id, usuario.Nome, usuario.Email);
}
