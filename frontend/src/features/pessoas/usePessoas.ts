import { useCallback, useEffect, useState } from 'react';
import { pessoasService } from '@/features/pessoas/pessoasService';
import { traduzirErro } from '@/lib/erros';
import type { Pessoa } from '@/types/pessoa';

export function usePessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    try {
      setPessoas(await pessoasService.listar());
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

  return { pessoas, carregando, erro, recarregar };
}
