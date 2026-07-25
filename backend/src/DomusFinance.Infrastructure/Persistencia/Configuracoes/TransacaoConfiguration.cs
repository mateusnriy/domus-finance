using DomusFinance.Domain.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DomusFinance.Infrastructure.Persistencia.Configuracoes;

public class TransacaoConfiguration : IEntityTypeConfiguration<Transacao>
{
    public void Configure(EntityTypeBuilder<Transacao> builder)
    {
        builder.ToTable("transacao");
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Id).HasColumnName("id").ValueGeneratedNever();
        builder.Property(t => t.Descricao).HasColumnName("descricao").HasMaxLength(200).IsRequired();
        builder.Property(t => t.Valor).HasColumnName("valor").HasPrecision(14, 2).IsRequired();
        builder.Property(t => t.Tipo).HasColumnName("tipo").HasConversion<string>().HasMaxLength(10).IsRequired();
        builder.Property(t => t.Data).HasColumnName("data").IsRequired();
        builder.Property(t => t.Categoria).HasColumnName("categoria").HasConversion<string>().HasMaxLength(20);
        builder.Property(t => t.PessoaId).HasColumnName("pessoa_id").IsRequired();
        builder.Property(t => t.CriadoEm).HasColumnName("criado_em").IsRequired();

        builder.ToTable(t =>
        {
            t.HasCheckConstraint("ck_transacao_valor_positivo", "valor > 0");

            // Tipo e categoria são domínios fechados; a restrição no banco barra valores fora do enum.
            t.HasCheckConstraint("ck_transacao_tipo", "tipo IN ('Despesa', 'Receita')");
            t.HasCheckConstraint("ck_transacao_categoria",
                "categoria IS NULL OR categoria IN " +
                "('Moradia','Alimentacao','Transporte','Saude','Educacao','Lazer','Contas','Outros')");
        });

        builder.HasIndex(t => t.PessoaId).HasDatabaseName("ix_transacao_pessoa_id");

        // Sustenta os filtros por período.
        builder.HasIndex(t => t.Data).HasDatabaseName("ix_transacao_data");
    }
}
