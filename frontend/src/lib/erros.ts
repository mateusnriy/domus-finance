import { AxiosError } from 'axios';

export const MENSAGEM_GENERICA = 'Não foi possível concluir a operação. Tente novamente.';

// RN13: as duas falhas de autenticação são indistinguíveis para o usuário.
export const MENSAGEM_CREDENCIAL_INVALIDA = 'E-mail ou senha inválidos.';

type ProblemDetails = {
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
};

export function traduzirErro(erro: unknown): string {
  if (!(erro instanceof AxiosError) || !erro.response) {
    console.error(erro);
    return MENSAGEM_GENERICA;
  }

  const { status, data } = erro.response;
  const problema = (data ?? {}) as ProblemDetails;

  if (status === 400 && problema.errors) {
    const mensagens = Object.values(problema.errors).flat();
    if (mensagens.length > 0) return mensagens.join(' ');
  }

  if (status === 404) {
    return problema.detail ?? 'Recurso não encontrado.';
  }

  // 409 (conflito) e 422 (regra de negócio) trazem texto pronto para o usuário.
  if (problema.detail) {
    return problema.detail;
  }

  console.error(erro);
  return MENSAGEM_GENERICA;
}
