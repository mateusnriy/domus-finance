import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route } from 'react-router-dom';
import { MENSAGEM_CREDENCIAL_INVALIDA } from '@/lib/erros';
import { renderizarRotas } from '@/testes/utilitarios';

const USUARIO = { id: '1', nome: 'Teste Silva', email: 'teste@exemplo.com' };

const login = vi.fn(async () => ({
  token: 'token-de-teste',
  expiraEm: '2026-07-28T00:00:00Z',
  usuario: USUARIO,
}));
const registrar = vi.fn(async () => USUARIO);

vi.mock('@/features/auth/authService', () => ({
  authService: {
    login: (...args: unknown[]) => login(...(args as [])),
    registrar: (...args: unknown[]) => registrar(...(args as [])),
    eu: vi.fn(),
  },
}));

const { default: LoginPage } = await import('@/features/auth/LoginPage');

function renderizarLogin() {
  return renderizarRotas(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/totais" element={<h1>Totais</h1>} />
    </>,
    { rota: '/login' },
  );
}

const abrirRegistro = () => userEvent.click(screen.getByRole('tab', { name: 'Registrar' }));

beforeEach(() => {
  login.mockClear();
  registrar.mockClear();
});

describe('autenticação', () => {
  it('bloqueia o envio do login com os campos vazios', async () => {
    renderizarLogin();

    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('O e-mail é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('A senha é obrigatória.')).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  // RN13: a mensagem não pode revelar se foi o e-mail ou a senha que falhou.
  it('mostra mensagem genérica quando a credencial é recusada', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    login.mockRejectedValueOnce(new Error('401'));

    renderizarLogin();

    await userEvent.type(screen.getByLabelText('E-mail'), 'teste@exemplo.com');
    await userEvent.type(screen.getByLabelText('Senha'), 'senha-errada');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    const alerta = await screen.findByRole('alert');

    expect(alerta).toHaveTextContent(MENSAGEM_CREDENCIAL_INVALIDA);
    expect(alerta).not.toHaveTextContent(/e-mail não|senha incorreta|não cadastrado/i);
  });

  it('entra na área autenticada após o login válido', async () => {
    renderizarLogin();

    await userEvent.type(screen.getByLabelText('E-mail'), 'teste@exemplo.com');
    await userEvent.type(screen.getByLabelText('Senha'), 'Demo@1234');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByRole('heading', { name: 'Totais' })).toBeInTheDocument();
    expect(login).toHaveBeenCalledWith({ email: 'teste@exemplo.com', senha: 'Demo@1234' });
  });

  // RN12: a senha mínima é validada no cliente antes de chegar ao servidor.
  it('recusa o registro com senha menor que oito caracteres', async () => {
    renderizarLogin();
    await abrirRegistro();

    await userEvent.type(await screen.findByLabelText('Nome'), 'Teste Silva');
    await userEvent.type(screen.getByLabelText('E-mail'), 'teste@exemplo.com');
    await userEvent.type(screen.getByLabelText('Senha'), 'curta');
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(
      await screen.findByText('A senha deve ter no mínimo 8 caracteres.'),
    ).toBeInTheDocument();
    expect(registrar).not.toHaveBeenCalled();
  });

  it('cria a conta e autentica em seguida', async () => {
    renderizarLogin();
    await abrirRegistro();

    await userEvent.type(await screen.findByLabelText('Nome'), 'Teste Silva');
    await userEvent.type(screen.getByLabelText('E-mail'), 'teste@exemplo.com');
    await userEvent.type(screen.getByLabelText('Senha'), 'Senha@1234');
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }));

    await waitFor(() =>
      expect(registrar).toHaveBeenCalledWith({
        nome: 'Teste Silva',
        email: 'teste@exemplo.com',
        senha: 'Senha@1234',
      }),
    );

    expect(await screen.findByRole('heading', { name: 'Totais' })).toBeInTheDocument();
  });
});
