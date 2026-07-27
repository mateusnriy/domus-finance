import apiClient from '@/lib/apiClient';
import type { LoginRequest, LoginResponse, RegistrarUsuarioRequest, Usuario } from '@/types/auth';

export const authService = {
  async login(dados: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', dados);
    return data;
  },

  // O endpoint devolve o usuário criado, não um token: a sessão só existe
  // depois do login, feito em seguida pelo AuthProvider.
  async registrar(dados: RegistrarUsuarioRequest): Promise<Usuario> {
    const { data } = await apiClient.post<Usuario>('/auth/registrar', dados);
    return data;
  },

  async eu(): Promise<Usuario> {
    const { data } = await apiClient.get<Usuario>('/auth/eu');
    return data;
  },
};
