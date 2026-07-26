using DomusFinance.Domain.Entidades;

namespace DomusFinance.Application.Seguranca;

public interface IGeradorDeToken
{
    (string Token, DateTime ExpiraEm) Gerar(Usuario usuario);
}
