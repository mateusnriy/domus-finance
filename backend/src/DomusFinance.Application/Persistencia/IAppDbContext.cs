using DomusFinance.Domain.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DomusFinance.Application.Persistencia;

// Abstrai o AppDbContext para que os serviços de Application acessem dados
// sem referenciar Infrastructure, mantendo a regra de dependência do domínio.
public interface IAppDbContext
{
    DbSet<Usuario> Usuarios { get; }
    DbSet<Pessoa> Pessoas { get; }
    DbSet<Transacao> Transacoes { get; }

    Task<int> SaveChangesAsync(CancellationToken ct);
}
