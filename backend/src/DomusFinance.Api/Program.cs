using System.Text;
using System.Text.Json.Serialization;
using DomusFinance.Api.Middlewares;
using DomusFinance.Application;
using DomusFinance.Application.Seguranca;
using DomusFinance.Infrastructure;
using DomusFinance.Infrastructure.Persistencia;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

var configuracaoJwt = builder.Configuration.GetSection("Jwt").Get<ConfiguracaoJwt>() ?? new ConfiguracaoJwt();
GarantirSegredoValido(configuracaoJwt);
builder.Services.AddSingleton(configuracaoJwt);

// Enums trafegam como texto nos contratos HTTP.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(ConfigurarDocumentacao);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = configuracaoJwt.Emissor,
        ValidAudience = configuracaoJwt.Audiencia,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuracaoJwt.Chave)),
        // Remove a tolerância padrão de 5 minutos: sem isso o token
        // sobreviveria cinco minutos além do prazo declarado.
        ClockSkew = TimeSpan.Zero
    });

builder.Services.AddAuthorization();

var origensPermitidas = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddPolicy("frontend", policy =>
    policy.WithOrigins(origensPermitidas).AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

await AplicarMigrationsComRetryAsync(app);

app.UseMiddleware<TratamentoDeErrosMiddleware>();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

// Falhar cedo e de forma ruidosa é preferível a executar com segurança degradada.
static void GarantirSegredoValido(ConfiguracaoJwt configuracao)
{
    if (string.IsNullOrWhiteSpace(configuracao.Chave))
        throw new InvalidOperationException(
            "Jwt:Chave não configurada. Defina a variável de ambiente JWT_CHAVE antes de iniciar a aplicação.");

    if (configuracao.Chave.Length < ConfiguracaoJwt.TamanhoMinimoChave)
        throw new InvalidOperationException(
            $"Jwt:Chave deve ter no mínimo {ConfiguracaoJwt.TamanhoMinimoChave} caracteres; " +
            $"a chave configurada tem {configuracao.Chave.Length}.");
}

static void ConfigurarDocumentacao(Swashbuckle.AspNetCore.SwaggerGen.SwaggerGenOptions options)
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Domus Finance", Version = "v1" });

    var esquema = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Informe apenas o token devolvido por /api/auth/login.",
        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
    };

    options.AddSecurityDefinition("Bearer", esquema);
    options.AddSecurityRequirement(new OpenApiSecurityRequirement { [esquema] = [] });
}

// Resiliência na inicialização: o banco pode ainda não aceitar conexões
// no instante em que a API sobe, mesmo com o container marcado como saudável.
static async Task AplicarMigrationsComRetryAsync(WebApplication app)
{
    const int tentativas = 10;
    var intervalo = TimeSpan.FromSeconds(3);

    using var escopo = app.Services.CreateScope();
    var contexto = escopo.ServiceProvider.GetRequiredService<AppDbContext>();
    var hasher = escopo.ServiceProvider.GetRequiredService<IHasherDeSenha>();
    var logger = escopo.ServiceProvider.GetRequiredService<ILogger<Program>>();

    for (var tentativa = 1; tentativa <= tentativas; tentativa++)
    {
        try
        {
            await contexto.Database.MigrateAsync();
            await DadosIniciais.AplicarAsync(contexto, hasher);
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
