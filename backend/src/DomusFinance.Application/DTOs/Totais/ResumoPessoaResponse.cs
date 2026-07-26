namespace DomusFinance.Application.DTOs.Totais;

public record ResumoPessoaResponse(
    Guid PessoaId,
    string Nome,
    int Idade,
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal Saldo);
