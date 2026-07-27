export type Usuario = { id: string; nome: string; email: string };

export type LoginResponse = { token: string; expiraEm: string; usuario: Usuario };

export type LoginRequest = { email: string; senha: string };

export type RegistrarUsuarioRequest = { nome: string; email: string; senha: string };
