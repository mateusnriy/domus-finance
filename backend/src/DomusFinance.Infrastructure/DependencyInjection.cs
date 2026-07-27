using DomusFinance.Application.Persistencia;
using DomusFinance.Application.Seguranca;
using DomusFinance.Infrastructure.Persistencia;
using DomusFinance.Infrastructure.Seguranca;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DomusFinance.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("Default")));

        services.AddScoped<IAppDbContext>(sp => sp.GetRequiredService<AppDbContext>());

        services.AddSingleton<IHasherDeSenha, HasherDeSenhaBCrypt>();
        services.AddSingleton<IGeradorDeToken, GeradorDeTokenJwt>();

        return services;
    }
}
