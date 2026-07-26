namespace DomusFinance.Application.Seguranca;

public class ConfiguracaoJwt
{
    // HS256 com chave curta enfraquece a assinatura.
    public const int TamanhoMinimoChave = 32;

    public string Chave { get; set; } = string.Empty;
    public string Emissor { get; set; } = string.Empty;
    public string Audiencia { get; set; } = string.Empty;
    public int HorasDeValidade { get; set; } = 8;
}
