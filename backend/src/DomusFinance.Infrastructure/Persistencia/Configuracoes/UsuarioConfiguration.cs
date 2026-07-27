using DomusFinance.Domain.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DomusFinance.Infrastructure.Persistencia.Configuracoes;

public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.ToTable("usuario");
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id).HasColumnName("id").ValueGeneratedNever();
        builder.Property(u => u.Nome).HasColumnName("nome").HasMaxLength(150).IsRequired();
        builder.Property(u => u.Email).HasColumnName("email").HasMaxLength(255).IsRequired();
        builder.Property(u => u.SenhaHash).HasColumnName("senha_hash").HasMaxLength(255).IsRequired();
        builder.Property(u => u.CriadoEm).HasColumnName("criado_em").IsRequired();

        // Unicidade no banco protege contra requisições concorrentes.
        builder.HasIndex(u => u.Email).IsUnique().HasDatabaseName("ux_usuario_email");
    }
}
