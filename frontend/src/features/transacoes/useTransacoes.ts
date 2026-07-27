import { useCallback, useEffect, useState } from 'react';
import { transacoesService } from '@/features/transacoes/transacoesService';
import { traduzirErro } from '@/lib/erros';
import type { FiltroTransacoes, Transacao } from '@/types/transacao';

// O filtro precisa chegar memorizado pela tela, senão cada render dispara
// uma nova busca.
export function useTransacoes(filtro: FiltroTransacoes) {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    try {
      setTransacoes(await transacoesService.listar(filtro));
      setErro('');
    } catch (falha) {
      setErro(traduzirErro(falha));
    } finally {
      setCarregando(false);
    }
  }, [filtro]);

  const recarregar = useCallback(async () => {
    setCarregando(true);
    await carregar();
  }, [carregar]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  return { transacoes, carregando, erro, recarregar };
}
