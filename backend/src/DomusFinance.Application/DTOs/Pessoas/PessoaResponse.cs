namespace DomusFinance.Application.DTOs.Pessoas;

public record PessoaResponse(Guid Id, string Nome, int Idade, bool MenorDeIdade, int QuantidadeTransacoes);
