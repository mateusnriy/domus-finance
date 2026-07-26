using DomusFinance.Application.Excecoes;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace DomusFinance.Api.Middlewares;

public class TratamentoDeErrosMiddleware(RequestDelegate proximo, ILogger<TratamentoDeErrosMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext contexto)
    {
        try
        {
            await proximo(contexto);
        }
        catch (ValidationException ex)
        {
            await EscreverErroDeValidacaoAsync(contexto, ex);
        }
        catch (NaoAutorizadoException ex)
        {
            await EscreverProblemaAsync(contexto, StatusCodes.Status401Unauthorized, "Não autorizado", ex.Message);
        }
        catch (RecursoNaoEncontradoException ex)
        {
            await EscreverProblemaAsync(contexto, StatusCodes.Status404NotFound, "Recurso não encontrado", ex.Message);
        }
        catch (ConflitoException ex)
        {
            await EscreverProblemaAsync(contexto, StatusCodes.Status409Conflict, "Conflito", ex.Message);
        }
        catch (RegraDeNegocioException ex)
        {
            await EscreverProblemaAsync(contexto, StatusCodes.Status422UnprocessableEntity, "Regra de negócio violada", ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro não tratado");
            await EscreverProblemaAsync(contexto, StatusCodes.Status500InternalServerError, "Erro interno", "Ocorreu um erro inesperado.");
        }
    }

    private static Task EscreverErroDeValidacaoAsync(HttpContext contexto, ValidationException ex)
    {
        var erros = ex.Errors
            .GroupBy(e => e.PropertyName)
            .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

        var problema = new ValidationProblemDetails(erros)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Um ou mais campos são inválidos."
        };

        contexto.Response.StatusCode = StatusCodes.Status400BadRequest;
        contexto.Response.ContentType = "application/problem+json";
        return contexto.Response.WriteAsJsonAsync(problema);
    }

    private static Task EscreverProblemaAsync(HttpContext contexto, int status, string titulo, string detalhe)
    {
        var problema = new ProblemDetails { Status = status, Title = titulo, Detail = detalhe };
        contexto.Response.StatusCode = status;
        contexto.Response.ContentType = "application/problem+json";
        return contexto.Response.WriteAsJsonAsync(problema);
    }
}
