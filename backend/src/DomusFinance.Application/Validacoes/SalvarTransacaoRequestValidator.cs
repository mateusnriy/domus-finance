using DomusFinance.Application.DTOs.Transacoes;
using FluentValidation;

namespace DomusFinance.Application.Validacoes;

public class SalvarTransacaoRequestValidator : AbstractValidator<SalvarTransacaoRequest>
{
    // Limite da coluna numeric(14,2).
    private const decimal ValorMaximo = 999_999_999_999.99m;

    public SalvarTransacaoRequestValidator()
    {
        RuleFor(r => r.Descricao)
            .NotEmpty().WithMessage("A descrição é obrigatória.")
            .MaximumLength(200).WithMessage("A descrição deve ter no máximo 200 caracteres.");

        RuleFor(r => r.Valor)
            .GreaterThan(0).WithMessage("O valor deve ser maior que zero.")
            .LessThanOrEqualTo(ValorMaximo).WithMessage("O valor excede o limite permitido.");

        RuleFor(r => r.Tipo)
            .IsInEnum().WithMessage("Tipo inválido.");

        RuleFor(r => r.Data)
            .NotEmpty().WithMessage("A data é obrigatória.")
            .Must(NaoSerFutura).WithMessage("A data não pode ser futura.");

        RuleFor(r => r.Categoria)
            .IsInEnum().WithMessage("Categoria inválida.")
            .When(r => r.Categoria.HasValue);

        RuleFor(r => r.PessoaId)
            .NotEmpty().WithMessage("A pessoa é obrigatória.");
    }

    // Comparação em UTC, mesma referência usada para CriadoEm (RN18).
    private static bool NaoSerFutura(DateOnly data) => data <= DateOnly.FromDateTime(DateTime.UtcNow);
}
