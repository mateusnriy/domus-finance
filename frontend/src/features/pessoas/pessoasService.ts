import apiClient from '@/lib/apiClient';
import type { Pessoa, SalvarPessoaRequest } from '@/types/pessoa';

export const pessoasService = {
  async listar(): Promise<Pessoa[]> {
    const { data } = await apiClient.get<Pessoa[]>('/pessoas');
    return data;
  },

  async criar(dados: SalvarPessoaRequest): Promise<Pessoa> {
    const { data } = await apiClient.post<Pessoa>('/pessoas', dados);
    return data;
  },

  async editar(id: string, dados: SalvarPessoaRequest): Promise<Pessoa> {
    const { data } = await apiClient.put<Pessoa>(`/pessoas/${id}`, dados);
    return data;
  },

  async excluir(id: string): Promise<void> {
    await apiClient.delete(`/pessoas/${id}`);
  },
};
