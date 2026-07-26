import { useCallback, useEffect, useState } from 'react';
import { totaisService } from '@/features/totais/totaisService';
import { traduzirErro } from '@/lib/erros';
import type { ResumoGeral } from '@/types/totais';

export function useTotais() {
  const [resumo, setResumo] = useState<ResumoGeral | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    try {
      setResumo(await totaisService.obter());
      setErro('');
    } catch (falha) {
      setErro(traduzirErro(falha));
    } finally {
      setCarregando(false);
    }
  }, []);

  const recarregar = useCallback(async () => {
    setCarregando(true);
    await carregar();
  }, [carregar]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  return { resumo, carregando, erro, recarregar };
}
