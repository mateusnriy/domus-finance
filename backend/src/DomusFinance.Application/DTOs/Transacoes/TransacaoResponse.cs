namespace DomusFinance.Application.DTOs.Transacoes;

public record TransacaoResponse(
    Guid Id,
    string Descricao,
    decimal Valor,
    string Tipo,
    DateOnly Data,
    string? Categoria,
    Guid PessoaId,
    string PessoaNome);
