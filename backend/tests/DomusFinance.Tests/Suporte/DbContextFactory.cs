using DomusFinance.Infrastructure.Persistencia;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace DomusFinance.Tests.Suporte;

// SQLite em memória por ser relacional: cascata e restrições valem de verdade.
// O provedor em memória puro não aplica integridade referencial e daria falsa segurança.
public sealed class DbContextFactory : IDisposable
{
    private readonly SqliteConnection _conexao;

    public DbContextFactory()
    {
        // A conexão precisa permanecer aberta: ao fechar, o banco é descartado.
        _conexao = new SqliteConnection("DataSource=:memory:");
        _conexao.Open();

        using (var comando = _conexao.CreateCommand())
        {
            comando.CommandText = "PRAGMA foreign_keys = ON;";
            comando.ExecuteNonQuery();
        }

        var opcoes = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(_conexao)
            .Options;

        Contexto = new AppDbContext(opcoes);
        Contexto.Database.EnsureCreated();
    }

    public AppDbContext Contexto { get; }

    public void Dispose()
    {
        Contexto.Dispose();
        _conexao.Dispose();
    }
}
