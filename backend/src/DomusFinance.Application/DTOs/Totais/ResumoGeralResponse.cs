namespace DomusFinance.Application.DTOs.Totais;

public record ResumoGeralResponse(
    IReadOnlyList<ResumoPessoaResponse> Pessoas,
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal SaldoLiquido,
    IReadOnlyList<ResumoCategoriaResponse> DespesasPorCategoria);
