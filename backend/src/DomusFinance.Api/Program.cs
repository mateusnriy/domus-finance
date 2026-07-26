using DomusFinance.Api.Middlewares;
using DomusFinance.Application;
using DomusFinance.Infrastructure;
using DomusFinance.Infrastructure.Persistencia;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Enums trafegam como texto nos contratos HTTP.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var origensPermitidas = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddPolicy("frontend", policy =>
    policy.WithOrigins(origensPermitidas).AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

await AplicarMigrationsComRetryAsync(app);

app.UseMiddleware<TratamentoDeErrosMiddleware>();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("frontend");
app.MapControllers();

app.Run();

// Resiliência na inicialização: o banco pode ainda não aceitar conexões
// no instante em que a API sobe, mesmo com o container marcado como saudável.
static async Task AplicarMigrationsComRetryAsync(WebApplication app)
{
    const int tentativas = 10;
    var intervalo = TimeSpan.FromSeconds(3);

    using var escopo = app.Services.CreateScope();
    var contexto = escopo.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = escopo.ServiceProvider.GetRequiredService<ILogger<Program>>();

    for (var tentativa = 1; tentativa <= tentativas; tentativa++)
    {
        try
        {
            await contexto.Database.MigrateAsync();
            await DadosIniciais.AplicarAsync(contexto);
            return;
        }
        catch (Exception ex) when (tentativa < tentativas)
        {
            logger.LogWarning(ex,
                "Falha ao aplicar migrations (tentativa {Tentativa}/{Total}). Nova tentativa em {Intervalo}s.",
                tentativa, tentativas, intervalo.TotalSeconds);
            await Task.Delay(intervalo);
        }
    }
}
