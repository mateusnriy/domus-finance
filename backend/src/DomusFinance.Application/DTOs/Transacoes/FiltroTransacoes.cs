using DomusFinance.Domain.Enums;

namespace DomusFinance.Application.DTOs.Transacoes;

public record FiltroTransacoes(
    Guid? PessoaId,
    TipoTransacao? Tipo,
    CategoriaTransacao? Categoria,
    DateOnly? DataInicio,
    DateOnly? DataFim);
