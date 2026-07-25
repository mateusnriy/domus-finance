using DomusFinance.Domain.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DomusFinance.Infrastructure.Persistencia.Configuracoes;

public class PessoaConfiguration : IEntityTypeConfiguration<Pessoa>
{
    public void Configure(EntityTypeBuilder<Pessoa> builder)
    {
        builder.ToTable("pessoa");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("id").ValueGeneratedNever();
        builder.Property(p => p.Nome).HasColumnName("nome").HasMaxLength(150).IsRequired();
        builder.Property(p => p.Idade).HasColumnName("idade").IsRequired();
        builder.Property(p => p.CriadoEm).HasColumnName("criado_em").IsRequired();

        builder.ToTable(t => t.HasCheckConstraint("ck_pessoa_idade", "idade >= 0 AND idade <= 130"));

        // Exclusão da pessoa remove as transações.
        builder.HasMany(p => p.Transacoes)
               .WithOne(t => t.Pessoa!)
               .HasForeignKey(t => t.PessoaId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
