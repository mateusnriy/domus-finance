using DomusFinance.Application.DTOs.Auth;
using FluentValidation;

namespace DomusFinance.Application.Validacoes;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(r => r.Email)
            .NotEmpty().WithMessage("O e-mail é obrigatório.");

        // Sem regra de tamanho mínimo: validá-la aqui revelaria a política
        // de senha a quem tenta adivinhar credenciais.
        RuleFor(r => r.Senha)
            .NotEmpty().WithMessage("A senha é obrigatória.");
    }
}
