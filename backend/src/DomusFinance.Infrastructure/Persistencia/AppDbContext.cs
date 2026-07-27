using DomusFinance.Application.Persistencia;
using DomusFinance.Domain.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DomusFinance.Infrastructure.Persistencia;

public class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Pessoa> Pessoas => Set<Pessoa>();
    public DbSet<Transacao> Transacoes => Set<Transacao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
        => modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
}
