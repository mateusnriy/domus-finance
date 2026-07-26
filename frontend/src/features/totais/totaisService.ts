import apiClient from '@/lib/apiClient';
import type { ResumoGeral } from '@/types/totais';

export const totaisService = {
  async obter(): Promise<ResumoGeral> {
    const { data } = await apiClient.get<ResumoGeral>('/totais');
    return data;
  },
};
