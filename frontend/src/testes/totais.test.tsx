import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import { RESUMO } from '@/testes/fixtures';
import { renderizarTela } from '@/testes/utilitarios';
import { MENSAGEM_GENERICA } from '@/lib/erros';
import { formatarBRL } from '@/lib/format';

const obter = vi.fn(async () => RESUMO);

vi.mock('@/features/totais/totaisService', () => ({
  totaisService: { obter: () => obter() },
}));

const { default: TotaisPage } = await import('@/features/totais/TotaisPage');

async function renderizarComResumo() {
  const resultado = renderizarTela(<TotaisPage />);
  await screen.findByText('Ana Souza');
  return resultado;
}

const linhaDe = (nome: string) => screen.getByText(nome).closest('tr') as HTMLTableRowElement;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('totais', () => {
  // RF06: quem não tem lançamento continua na consolidação, zerado.
  it('exibe a pessoa sem transações com zeros e sem barra', async () => {
    await renderizarComResumo();

    const linha = linhaDe('Carla Nunes');

    expect(linha.cells[1].textContent).toBe(formatarBRL(0));
    expect(linha.cells[2].textContent).toBe(formatarBRL(0));
    expect(linha.cells[3].textContent).toBe(formatarBRL(0));
    expect(within(linha).queryByRole('img')).not.toBeInTheDocument();
  });

  // RN07: o saldo negativo precisa ser reconhecível, não apenas legível.
  it('destaca o saldo negativo com a cor de negativo', async () => {
    await renderizarComResumo();

    const saldo = linhaDe('Bruno Lima').cells[3];

    expect(saldo.textContent).toBe(formatarBRL(-230));
    expect(saldo).toHaveClass('text-negative');
  });

  // RN08: o total geral é a soma das linhas exibidas.
  it('mostra o total geral correspondente às linhas', async () => {
    await renderizarComResumo();

    const total = screen.getByText('Total geral').closest('tr') as HTMLTableRowElement;

    expect(total.cells[1].textContent).toBe(formatarBRL(4500));
    expect(total.cells[2].textContent).toBe(formatarBRL(1200.5));
    expect(total.cells[3].textContent).toBe(formatarBRL(3299.5));
  });

  it('descreve a barra de proporção com receitas e despesas', async () => {
    await renderizarComResumo();

    const barra = within(linhaDe('Ana Souza')).getByRole('img');

    expect(barra).toHaveAccessibleName(
      `Receitas de ${formatarBRL(4500)}, despesas de ${formatarBRL(970.5)}`,
    );
  });

  // RF23: as despesas sem categoria são agrupadas, não omitidas.
  it('agrupa as despesas por categoria, incluindo as sem categoria', async () => {
    await renderizarComResumo();

    const itens = screen.getAllByRole('listitem');

    expect(itens.map((item) => item.textContent)).toEqual([
      `Alimentação${formatarBRL(820.5)}`,
      `Educação${formatarBRL(230)}`,
      `Sem categoria${formatarBRL(150)}`,
    ]);
  });

  it('mostra o estado vazio quando não há pessoas cadastradas', async () => {
    obter.mockResolvedValueOnce({
      pessoas: [],
      totalReceitas: 0,
      totalDespesas: 0,
      saldoLiquido: 0,
      despesasPorCategoria: [],
    });

    renderizarTela(<TotaisPage />);

    expect(await screen.findByText('Nada a consolidar')).toBeInTheDocument();
  });

  it('mostra a mensagem de erro quando a consolidação falha', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    obter.mockRejectedValueOnce(new Error('falha de rede'));

    renderizarTela(<TotaisPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(MENSAGEM_GENERICA);
  });
});
