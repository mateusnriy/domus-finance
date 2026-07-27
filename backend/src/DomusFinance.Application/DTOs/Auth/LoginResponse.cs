namespace DomusFinance.Application.DTOs.Auth;

public record LoginResponse(string Token, DateTime ExpiraEm, UsuarioResponse Usuario);
