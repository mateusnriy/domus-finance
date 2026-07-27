import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PESSOAS } from '@/testes/fixtures';
import { renderizarTela } from '@/testes/utilitarios';

vi.mock('@/features/pessoas/pessoasService', () => ({
  pessoasService: {
    listar: vi.fn(async () => PESSOAS),
    criar: vi.fn(),
    editar: vi.fn(),
    excluir: vi.fn(),
  },
}));

const { default: PessoasPage } = await import('@/features/pessoas/PessoasPage');
const { default: LoginPage } = await import('@/features/auth/LoginPage');

describe('operação por teclado', () => {
  it('modal recebe o foco ao abrir e devolve ao gatilho ao fechar com Esc', async () => {
    renderizarTela(<PessoasPage />);
    await screen.findByText('Ana Souza');

    const gatilho = screen.getByRole('button', { name: 'Excluir Ana Souza' });
    gatilho.focus();
    await userEvent.keyboard('{Enter}');

    const dialogo = await screen.findByRole('dialog');
    expect(dialogo).toContainElement(document.activeElement as HTMLElement);

    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(document.activeElement).toBe(gatilho);
  });

  it('foco fica contido no modal ao tabular', async () => {
    renderizarTela(<PessoasPage />);
    await screen.findByText('Ana Souza');

    await userEvent.click(screen.getByRole('button', { name: 'Excluir Ana Souza' }));
    const dialogo = await screen.findByRole('dialog');

    for (let volta = 0; volta < 6; volta += 1) {
      await userEvent.tab();
      expect(dialogo).toContainElement(document.activeElement as HTMLElement);
    }
  });

  it('abas do login trocam com as setas', async () => {
    renderizarTela(<LoginPage />, { comMain: false });

    const abaEntrar = screen.getByRole('tab', { name: 'Entrar' });
    abaEntrar.focus();

    await userEvent.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Registrar' })).toHaveAttribute('aria-selected', 'true');
    expect(await screen.findByLabelText('Nome')).toBeInTheDocument();
  });

  it('formulário de pessoa é operável e enviável por teclado', async () => {
    renderizarTela(<PessoasPage />);
    await screen.findByText('Ana Souza');

    await userEvent.click(screen.getByRole('button', { name: /adicionar/i }));

    await userEvent.type(await screen.findByLabelText('Nome'), 'Daniel Rocha');
    await userEvent.type(screen.getByLabelText('Idade'), '41');
    await userEvent.keyboard('{Enter}');

    const { pessoasService } = await import('@/features/pessoas/pessoasService');
    await waitFor(() =>
      expect(pessoasService.criar).toHaveBeenCalledWith({ nome: 'Daniel Rocha', idade: 41 }),
    );
  });
});
