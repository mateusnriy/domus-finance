using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using DomusFinance.Application.DTOs.Auth;
using DomusFinance.Application.Excecoes;
using DomusFinance.Application.Servicos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DomusFinance.Api.Controllers;

[ApiController]
[Route("api/auth")]
[Authorize]
public class AuthController(AutenticacaoService servico) : ControllerBase
{
    // Cria uma conta de acesso ao sistema.
    [HttpPost("registrar")]
    [AllowAnonymous]
    public async Task<ActionResult<UsuarioResponse>> Registrar(RegistrarUsuarioRequest request, CancellationToken ct)
    {
        var usuario = await servico.RegistrarAsync(request, ct);
        return Created($"/api/auth/{usuario.Id}", usuario);
    }

    // Autentica e devolve o token de acesso.
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request, CancellationToken ct)
        => Ok(await servico.AutenticarAsync(request, ct));

    // Devolve os dados do usuário da sessão corrente.
    [HttpGet("eu")]
    public async Task<ActionResult<UsuarioResponse>> Eu(CancellationToken ct)
        => Ok(await servico.ObterPerfilAsync(ObterIdDoUsuario(), ct));

    private Guid ObterIdDoUsuario()
    {
        // O handler do JWT traduz "sub" para NameIdentifier ao montar a identidade.
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
                  ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        return Guid.TryParse(sub, out var id)
            ? id
            : throw new NaoAutorizadoException("Token inválido.");
    }
}
