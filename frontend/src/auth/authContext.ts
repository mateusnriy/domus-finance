import { createContext } from 'react';
import type { Usuario } from '@/types/auth';

export type ContextoAuth = {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  sair: () => void;
};

export const AuthContext = createContext<ContextoAuth | null>(null);
