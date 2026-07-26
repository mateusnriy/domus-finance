using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DomusFinance.Application.Seguranca;
using DomusFinance.Domain.Entidades;
using Microsoft.IdentityModel.Tokens;

namespace DomusFinance.Infrastructure.Seguranca;

public class GeradorDeTokenJwt(ConfiguracaoJwt configuracao) : IGeradorDeToken
{
    public (string Token, DateTime ExpiraEm) Gerar(Usuario usuario)
    {
        var expiraEm = DateTime.UtcNow.AddHours(configuracao.HorasDeValidade);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Name, usuario.Nome),
            new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var credenciais = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuracao.Chave)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: configuracao.Emissor,
            audience: configuracao.Audiencia,
            claims: claims,
            expires: expiraEm,
            signingCredentials: credenciais);

        return (new JwtSecurityTokenHandler().WriteToken(token), expiraEm);
    }
}
