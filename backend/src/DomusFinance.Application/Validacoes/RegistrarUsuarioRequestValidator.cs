using DomusFinance.Application.DTOs.Auth;
using DomusFinance.Domain.Entidades;
using FluentValidation;

namespace DomusFinance.Application.Validacoes;

public class RegistrarUsuarioRequestValidator : AbstractValidator<RegistrarUsuarioRequest>
{
    public RegistrarUsuarioRequestValidator()
    {
        RuleFor(r => r.Nome)
            .NotEmpty().WithMessage("O nome é obrigatório.")
            .MaximumLength(150).WithMessage("O nome deve ter no máximo 150 caracteres.");

        RuleFor(r => r.Email)
            .NotEmpty().WithMessage("O e-mail é obrigatório.")
            .EmailAddress().WithMessage("E-mail inválido.")
            .MaximumLength(255).WithMessage("O e-mail deve ter no máximo 255 caracteres.");

        RuleFor(r => r.Senha)
            .NotEmpty().WithMessage("A senha é obrigatória.")
            .MinimumLength(Usuario.TamanhoMinimoSenha)
            .WithMessage($"A senha deve ter no mínimo {Usuario.TamanhoMinimoSenha} caracteres.");
    }
}
