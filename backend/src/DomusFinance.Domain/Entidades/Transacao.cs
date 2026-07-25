using DomusFinance.Domain.Enums;

namespace DomusFinance.Domain.Entidades;

// Movimentação financeira vinculada a uma pessoa.
public class Transacao
{
    private Transacao() { }

    public Transacao(string descricao, decimal valor, TipoTransacao tipo,
                     DateOnly data, CategoriaTransacao? categoria, Guid pessoaId)
    {
        Id = Guid.NewGuid();
        Descricao = descricao.Trim();
        Valor = valor;
        Tipo = tipo;
        Data = data;
        Categoria = categoria;
        PessoaId = pessoaId;
        CriadoEm = DateTime.UtcNow;
    }

    public Guid Id { get; private set; }
    public string Descricao { get; private set; } = string.Empty;

    // Sempre positivo. O sentido financeiro vem do Tipo, nunca do sinal.
    public decimal Valor { get; private set; }

    public TipoTransacao Tipo { get; private set; }

    // Data do fato, distinta de CriadoEm, que é o instante do registro (RN18).
    public DateOnly Data { get; private set; }

    public CategoriaTransacao? Categoria { get; private set; }

    public Guid PessoaId { get; private set; }
    public Pessoa? Pessoa { get; private set; }
    public DateTime CriadoEm { get; private set; }

    // A pessoa não muda na edição. Regras revalidadas na aplicação (RN20).
    public void Atualizar(string descricao, decimal valor, TipoTransacao tipo,
                          DateOnly data, CategoriaTransacao? categoria)
    {
        Descricao = descricao.Trim();
        Valor = valor;
        Tipo = tipo;
        Data = data;
        Categoria = categoria;
    }
}
