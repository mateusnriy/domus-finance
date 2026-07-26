import apiClient from '@/lib/apiClient';
import type { FiltroTransacoes, SalvarTransacaoRequest, Transacao } from '@/types/transacao';

// Filtros vazios não viram query string: o backend trata ausência como "todos".
const somentePreenchidos = (filtro: FiltroTransacoes) =>
  Object.fromEntries(Object.entries(filtro).filter(([, valor]) => valor !== '' && valor != null));

export const transacoesService = {
  async listar(filtro: FiltroTransacoes = {}): Promise<Transacao[]> {
    const { data } = await apiClient.get<Transacao[]>('/transacoes', {
      params: somentePreenchidos(filtro),
    });
    return data;
  },

  async criar(dados: SalvarTransacaoRequest): Promise<Transacao> {
    const { data } = await apiClient.post<Transacao>('/transacoes', dados);
    return data;
  },

  async editar(id: string, dados: SalvarTransacaoRequest): Promise<Transacao> {
    const { data } = await apiClient.put<Transacao>(`/transacoes/${id}`, dados);
    return data;
  },

  async excluir(id: string): Promise<void> {
    await apiClient.delete(`/transacoes/${id}`);
  },
};
