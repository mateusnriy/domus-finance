import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/auth/authContext';
import { authService } from '@/features/auth/authService';
import apiClient, { CHAVE_TOKEN } from '@/lib/apiClient';
import type { Usuario } from '@/types/auth';

type AuthProviderProps = { children: ReactNode };

export default function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(() => localStorage.getItem(CHAVE_TOKEN) !== null);
  const navigate = useNavigate();

  // Recarregar a página não pode derrubar a sessão: com token guardado, o
  // perfil é restaurado pelo servidor antes de liberar as rotas protegidas.
  // Sem token não há nada a restaurar, e o estado inicial já nasce pronto.
  useEffect(() => {
    if (localStorage.getItem(CHAVE_TOKEN) === null) return;

    let ativo = true;

    authService
      .eu()
      .then((perfil) => {
        if (ativo) setUsuario(perfil);
      })
      .catch(() => localStorage.removeItem(CHAVE_TOKEN))
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const entrar = useCallback(
    async (email: string, senha: string) => {
      const resposta = await authService.login({ email, senha });

      localStorage.setItem(CHAVE_TOKEN, resposta.token);
      setUsuario(resposta.usuario);
      navigate('/totais');
    },
    [navigate],
  );

  const registrar = useCallback(
    async (nome: string, email: string, senha: string) => {
      await authService.registrar({ nome, email, senha });
      await entrar(email, senha);
    },
    [entrar],
  );

  const sair = useCallback(() => {
    localStorage.removeItem(CHAVE_TOKEN);
    delete apiClient.defaults.headers.common.Authorization;
    setUsuario(null);
    navigate('/login');
  }, [navigate]);

  const valor = useMemo(
    () => ({ usuario, carregando, entrar, registrar, sair }),
    [usuario, carregando, entrar, registrar, sair],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
