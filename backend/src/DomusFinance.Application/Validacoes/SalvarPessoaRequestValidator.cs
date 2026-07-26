using DomusFinance.Application.DTOs.Pessoas;
using FluentValidation;

namespace DomusFinance.Application.Validacoes;

public class SalvarPessoaRequestValidator : AbstractValidator<SalvarPessoaRequest>
{
    public SalvarPessoaRequestValidator()
    {
        RuleFor(r => r.Nome)
            .NotEmpty().WithMessage("O nome é obrigatório.")
            .MaximumLength(150).WithMessage("O nome deve ter no máximo 150 caracteres.");

        RuleFor(r => r.Idade)
            .InclusiveBetween(0, 130).WithMessage("A idade deve estar entre 0 e 130.");
    }
}
