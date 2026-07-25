namespace DomusFinance.Domain.Entidades;

//Morador cujas finanças são controladas.
public class Pessoa
{
    public const int IdadeMinimaMaioridade = 18;

    private Pessoa() { }

    public Pessoa(string nome, int idade)
    {
        Id = Guid.NewGuid();
        Nome = nome.Trim();
        Idade = idade;
        CriadoEm = DateTime.UtcNow;
    }

    public Guid Id { get; private set; }
    public string Nome { get; private set; } = string.Empty;
    public int Idade { get; private set; }
    public DateTime CriadoEm { get; private set; }

    public ICollection<Transacao> Transacoes { get; private set; } = new List<Transacao>();

    // base da restrição de tipo de transação para menores de idade.
    public bool EhMenorDeIdade() => Idade < IdadeMinimaMaioridade;

    // validação de formato fica na camada de aplicação.
    public void Atualizar(string nome, int idade)
    {
        Nome = nome.Trim();
        Idade = idade;
    }
}
