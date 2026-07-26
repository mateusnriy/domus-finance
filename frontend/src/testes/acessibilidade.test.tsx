import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PESSOAS, RESUMO, TRANSACOES } from '@/testes/fixtures';
import { renderizarTela, violacoesDeAcessibilidade } from '@/testes/utilitarios';

vi.mock('@/features/pessoas/pessoasService', () => ({
  pessoasService: {
    listar: vi.fn(async () => PESSOAS),
    criar: vi.fn(),
    editar: vi.fn(),
    excluir: vi.fn(),
  },
}));

vi.mock('@/features/transacoes/transacoesService', () => ({
  transacoesService: {
    listar: vi.fn(async () => TRANSACOES),
    criar: vi.fn(),
    editar: vi.fn(),
    excluir: vi.fn(),
  },
}));

vi.mock('@/features/totais/totaisService', () => ({
  totaisService: { obter: vi.fn(async () => RESUMO) },
}));

const { default: LoginPage } = await import('@/features/auth/LoginPage');
const { default: PessoasPage } = await import('@/features/pessoas/PessoasPage');
const { default: TransacoesPage } = await import('@/features/transacoes/TransacoesPage');
const { default: TotaisPage } = await import('@/features/totais/TotaisPage');

describe('acessibilidade das telas', () => {
  it('login não tem violações', async () => {
    const { container } = renderizarTela(<LoginPage />, { comMain: false });

    await screen.findByLabelText('E-mail');
    expect(await violacoesDeAcessibilidade(container)).toEqual([]);
  });

  it('login não tem violações na aba de registro', async () => {
    const { container } = renderizarTela(<LoginPage />, { comMain: false });

    await userEvent.click(screen.getByRole('tab', { name: 'Registrar' }));
    await screen.findByLabelText('Nome');

    expect(await violacoesDeAcessibilidade(container)).toEqual([]);
  });

  it('pessoas não tem violações, com a lista carregada', async () => {
    const { container } = renderizarTela(<PessoasPage />);

    await screen.findByText('Ana Souza');
    expect(await violacoesDeAcessibilidade(container)).toEqual([]);
  });

  it('pessoas não tem violações com o formulário aberto', async () => {
    const { container } = renderizarTela(<PessoasPage />);
    await screen.findByText('Ana Souza');

    await userEvent.click(screen.getByRole('button', { name: /adicionar/i }));
    await screen.findByLabelText('Nome');

    expect(await violacoesDeAcessibilidade(container)).toEqual([]);
  });

  it('pessoas não tem violações com o modal de exclusão aberto', async () => {
    const { container } = renderizarTela(<PessoasPage />);
    await screen.findByText('Ana Souza');

    await userEvent.click(screen.getByRole('button', { name: 'Excluir Ana Souza' }));
    await screen.findByRole('dialog');

    expect(await violacoesDeAcessibilidade(container)).toEqual([]);
  });

  it('transações não tem violações, com filtros e lista', async () => {
    const { container } = renderizarTela(<TransacoesPage />);

    await screen.findByText('Supermercado');
    expect(await violacoesDeAcessibilidade(container)).toEqual([]);
  });

  it('transações não tem violações com o formulário aberto', async () => {
    const { container } = renderizarTela(<TransacoesPage />);
    await screen.findByText('Supermercado');

    await userEvent.click(screen.getByRole('button', { name: /adicionar/i }));
    await screen.findByLabelText('Descrição');

    expect(await violacoesDeAcessibilidade(container)).toEqual([]);
  });

  it('totais não tem violações', async () => {
    const { container } = renderizarTela(<TotaisPage />);

    await screen.findByText('Ana Souza');
    expect(await violacoesDeAcessibilidade(container)).toEqual([]);
  });
});
