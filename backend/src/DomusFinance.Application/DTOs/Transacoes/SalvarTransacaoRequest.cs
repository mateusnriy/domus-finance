using DomusFinance.Domain.Enums;

namespace DomusFinance.Application.DTOs.Transacoes;

// PessoaId é ignorado na edição: a transação não muda de dono (RF19).
public record SalvarTransacaoRequest(
    string Descricao,
    decimal Valor,
    TipoTransacao Tipo,
    DateOnly Data,
    CategoriaTransacao? Categoria,
    Guid PessoaId);
