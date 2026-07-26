using DomusFinance.Application.Servicos;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace DomusFinance.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssemblyContaining<PessoaService>();
        services.AddScoped<PessoaService>();
        services.AddScoped<TransacaoService>();

        return services;
    }
}
